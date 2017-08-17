
import * as express from 'express';
import * as fs from 'fs';
import * as jimp from 'jimp';

import { Converter } from '../converter';
import { AzureStorage, AzureDatabase } from '../azure-service';
import * as objects from '../Objects';
import { DaikonConverter } from '../daikon/daikon';
import { StatusCode, storagePath, imagePath } from '../constants';


// Upload status to notify client which files have been succesful.
interface UploadStatus {
    name: string;
    id: string;
    err: string;
}

// Chain status for inner class' purposes.
interface ChainStatus extends UploadStatus {
    filename: string;
}

interface Image {
    imageNumber: number,
    imageID: string
};

export class UploadController {
    public responses: ChainStatus[] = [];

    constructor() {
        this.Root = this.Root.bind(this);
        this.convert = this.convert.bind(this);
        this.upload = this.upload.bind(this);
        this.parse = this.parse.bind(this);
        this.createThumbnail = this.createThumbnail.bind(this);
    }

    Root = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let files = req.files as Express.Multer.File[];

        // If none or zero files were sent, send a null response.
        if (files === undefined) { next(); return null; }
        if (files.length === 0) { next(); return null; }

        // Convert, upload and parse the files.
        await this.convert(files);
        let createThumbnails = this.createThumbnails();
        await this.upload();
        let json = await this.parse();
        console.log("inserting to db");
        for (let key in json) {
            console.log('inserting ' + key);

            await AzureDatabase.updateToImageCollection(json[key]);
        }

        //await createThumbnails;

        // Cleanup.
        files.forEach((file) => {
            //console.log("[Deleting files] file: " + file.path);
            fs.unlink(file.path, () => { });
            //console.log("[Deleting files] image: " + file.filename);
            fs.unlink(imagePath + file.filename + ".png", () => { });
            console.log("[Deleting files] file: " + file.filename + " OK ✔️");
        });

        // Grab all ChainStatuses and map them to UploadStatuses.
        let statuses: UploadStatus[] = this.responses.map((upload) => {
            return { name: upload.name, id: upload.id, err: upload.err };
        });
        // Then assign a unique_id and UploadStatuses.
        //req.params.statuses = { upload_id: json.uploadID, statuses: statuses };
        next();
    }

    async convert(files: Express.Multer.File[]) {
        // Upload all the files from the request to the AzureStorage.
        const conversion = files.map(async (file) => {
            try {
                var response: ChainStatus = {
                    name: file.originalname,
                    id: null,
                    err: null,
                    filename: file.filename
                };
                await Converter.toPng(file.filename);
            } catch (e) {
                // If anything happened during conversion, assign an error to the response.
                response.err = "Conversion Error";
            }
            return response;
        });
        // Await for all conversions.
        this.responses = await Promise.all(conversion);
    }

    async upload() {
        // Iterate over conversions and send them to the Azure.
        const uploads = this.responses.map(async (upload) => {
            try {
                if (upload.err) return upload;
                // Else upload the DICOM and PNG.
                /*
                await AzureStorage.toDicoms(
                    upload.filename,
                    storagePath + upload.filename);
                */
                await AzureStorage.toImages(
                    upload.filename + ".png",
                    imagePath + upload.filename + ".png");
                // Assign the upload id to this file.
                upload.id = upload.filename;
                console.log('[Uploading] file: ' + upload.filename + ' OK ✔️');
            } catch (e) {
                // If anything happened during uploading, assign an error to the response.
                console.log('[Uploading] file: ' + upload.filename + ' FAIL ❌');
                console.log(e);
                upload.err = "Storage Error";
            }
            return upload;
        });
        // Await for all uploads.
        this.responses = await Promise.all(uploads);
    }

    async parse() {
        let patients = {};
        //patients[0] = new objects.UploadJSON();
        // get patients from database
        let getPatients = this.responses.map(async (parse) => {
            let conv = new DaikonConverter(storagePath + parse.filename);
            let patientID = conv.getPatientID();
            let patientAzure = await AzureDatabase.getPatientDocument(patientID);
            patients[patientID] = patientAzure;
        });
        // w8 'till all patients are fetched
        await Promise.all(getPatients)

        // parse info from all dicom files and save to db
        let parses = this.responses.forEach((parse) => {
            if (parse.err) return;
            console.log("patient parsing start");
            let converter = new DaikonConverter(storagePath + parse.filename);
            let patientID = converter.getPatientID();
            let patientBirthday = converter.getPatientDateOfBirth();
            let patientName = converter.getPatientName();
            let studyID = converter.getStudyInstanceUID();
            let studyFound: boolean = true;
            let seriesFound: boolean = true;

            let patient = patients[patientID];
            if (patient == null) {
                patient = new objects.UploadJSON();
                patient.patientID = patientID;
                patient.patientName = patientName;
                patient.patientBirtday = patientBirthday;
            }

            let existingStudy = patient.studies.find((stud) => {
                return stud.studyID === studyID;
            });

            if (existingStudy === undefined) {
                studyFound = false;
                existingStudy = new objects.StudyJSON();
            }
            existingStudy.studyID = converter.getStudyInstanceUID();
            existingStudy.studyDescription = converter.getStudyDescription();

            let seriesID = converter.getSeriesUID();
            let existingSeries = existingStudy.series.find((seria) => {
                return seria.seriesID === seriesID;
            });

            if (existingSeries === undefined) {
                seriesFound = false;
                existingSeries = new objects.SeriesJSON();
                existingSeries.seriesID = seriesID;
            }

            existingSeries.seriesDescription = converter.getSeriesDescription();
            existingSeries.seriesID = converter.getSeriesUID();

            let newImage = {
                imageID: parse.filename,
                imageNumber: Number(converter.getImageNumber())
            };
            if (existingSeries.images.length > 0) {
                let existingImage = existingSeries.images.find((image) => {
                    return image.imageNumber === newImage.imageNumber;
                });
                if (existingImage == undefined) existingSeries.images.push(newImage);
            } else {
                existingSeries.images.push(newImage);
            }

            if (!seriesFound) {
                existingStudy.series.push(existingSeries);
            }

            if (!studyFound) {
                patient.studies.push(existingStudy);
            }
            patients[patientID] = patient;
        });

        for (var patientKey in patients) {
            let patient = patients[patientKey];
            for (var studyKey in patient.studies) {
                let study = patient.studies[studyKey];
                for (var seriesKey in study.series) {
                    let series = study.series[seriesKey];
                    let images = series.images;
                    images.sort((a: Image, b: Image) => {
                        if (a.imageNumber < b.imageNumber) return -1;
                        if (a.imageNumber > b.imageNumber) return 1;
                        return 0;
                    });
                    // In case of even numbers, for example 4, Math.round would give 3rd element as the middle one
                    // Math.floor would return the 2nd element 
                    var middle = images[Math.floor((images.length - 1) / 2)];
                    //await this.createThumbnail(middle.imageID);
                    series.thumbnailImageID = middle.imageID
                }

            }
        }
        return patients;
    }

    async createThumbnails() {
        // Iterate over conversions and send them to the Azure.
        const thumbnails = this.responses.map(async (thumbnail) => {
            try {
                if (thumbnail.err) return thumbnail;
                console.log(thumbnail);
                this.createThumbnail(thumbnail.filename);

            } catch (e) {
                // If anything happened during uploading, assign an error to the response.
                console.log('[Uploading] file: ' + thumbnail.filename + ' FAIL ❌');
                console.log(e);
                thumbnail.err = "Storage Error";
            }
            return thumbnail;
        });
        // Await for all uploads.
        return await Promise.all(thumbnails);
    }


    createThumbnail(imageID) {
        jimp.read(imagePath + imageID + ".png", async function (err, image) {
            // do stuff with the image (if no exception) 
            let thumbnail = imagePath + imageID + '_.png';
            if (err === null) {
                image.background(0x000000FF)
                    .contain(300, 300)
                    .write(thumbnail, async (err, image) => {
                        if (err === null) {
                            await AzureStorage.toImages(imageID + '_.png', thumbnail);
                            fs.unlink(thumbnail, () => { });
                        } else {
                        }
                    });

            } else {
                console.log("[Create Thumbnail] Error");
                console.log(err);
            }
        });
    }
    /*
        createThumbnail(imageID) {
            return new Promise<string>((resolve, reject) => {
                jimp.read(imagePath + imageID + ".png", async function (err, image) {
                    // do stuff with the image (if no exception) 
                    let thumbnail = imagePath + imageID + '_.png';
                    if (err === null) {
                        image.background(0x000000FF)
                            .contain(300, 300)
                            .write(thumbnail, async (err, image) => {
                                if (err === null) {
                                    await AzureStorage.toImages(imageID + '_.png', thumbnail);
                                    fs.unlink(thumbnail, () => { });
                                    resolve("OK")
                                } else {
                                    reject("NO OK")
                                }
                            });
    
                    } else {
                        console.log("[Create Thumbnail] Error");
                        console.log(err);
                        reject("NOT OK")
                    }
                });
            });
        }
        */



}