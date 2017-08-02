
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
        await this.upload();
        let json = await this.parse();
        await AzureDatabase.insertToImagesCollection(json);

        // Cleanup.
        files.forEach((file) => {
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + ".png", () => { });
        });

        // Grab all ChainStatuses and map them to UploadStatuses.
        let statuses: UploadStatus[] = this.responses.map((upload) => {
            return { name: upload.name, id: upload.id, err: upload.err };
        });
        // Then assign a unique_id and UploadStatuses.
        req.params.statuses = { upload_id: json.uploadID, statuses: statuses };
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
                await AzureStorage.toDicoms(
                    upload.filename,
                    storagePath + upload.filename);
                await AzureStorage.toImages(
                    upload.filename + ".png",
                    imagePath + upload.filename + ".png");
                // Assign the upload id to this file.
                upload.id = upload.filename;
            } catch (e) {
                // If anything happened during uploading, assign an error to the response.
                upload.err = "Storage Error";
            }
            return upload;
        });
        // Await for all uploads.
        this.responses = await Promise.all(uploads);
    }

    async parse() {
        // TODO: Refactor!
        let json = new objects.UploadJSON();
        json.uploadID = new Date().getTime();
        json.uploadDate = new Date();
        let studiesArray: Image[][][] = [];   

        let parses = this.responses.forEach((parse) => {
            if (parse.err) return;
            let converter = new DaikonConverter(storagePath + parse.filename);
            let studyID = converter.getStudyInstanceUID();
            let studyFound: boolean = true;
            let seriesFound: boolean = true;
            let existingStudy = json.studies.find((stud) => {
                return stud.studyID === studyID;
            });

            if (existingStudy === undefined) {
                studyFound = false;
                existingStudy = new objects.StudyJSON();
                studiesArray[studyID] = [];
            }
            existingStudy.studyID = converter.getStudyInstanceUID();
            existingStudy.studyDescription = converter.getStudyDescription();
            existingStudy.patientBirthday = converter.getPatientDateOfBirth();
            existingStudy.patientName = converter.getPatientName();

            let seriesID = converter.getSeriesUID();
            let existingSeries = existingStudy.series.find((seria) => {
                return seria.seriesID === seriesID;
            });

            if (existingSeries === undefined) {
                seriesFound = false;
                existingSeries = new objects.SeriesJSON();
                existingSeries.seriesID = seriesID;
                studiesArray[studyID][seriesID] = [];
            }

            existingSeries.seriesDescription = converter.getSeriesDescription();
            existingSeries.seriesID = converter.getSeriesUID();

            studiesArray[studyID][seriesID].push({ imageNumber: Number(converter.getImageNumber()), imageID: parse.filename });

            existingSeries.images.push(parse.filename);

            if (!seriesFound) {
                existingStudy.series.push(existingSeries);
            }

            if (!studyFound) {
                json.studies.push(existingStudy);
            }
        });

        for (var study in studiesArray) {
            for (var series in studiesArray[study]) {
                let images = studiesArray[study][series];
                images.sort((a: Image, b: Image) => {
                    if (a.imageNumber < b.imageNumber) return -1;
                    if (a.imageNumber > b.imageNumber) return 1;
                    return 0;
                });
                // In case of even numbers, for example 4, Math.round would give 3rd element as the middle one
                // Math.floor would return the 2nd element 
                var middle = images[Math.floor((images.length - 1) / 2)];
                await this.createThumbnail(middle.imageID);

                json.studies.find((stud) => {
                    return stud.studyID === study;
                }).series.find((seria) => {
                    return seria.seriesID === series;
                }).thumbnailImageID = middle.imageID;

            }
        }

        return json;
    }


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
                    reject("NOT OK")
                }
            });
        });
    }

}