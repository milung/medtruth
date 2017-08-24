import * as fs from 'fs';
import { storagePath, imagePath } from "../constants";
import { Converter } from "../converter";
import * as PromiseBB from 'bluebird';
import { AzureDatabase, AzureStorage } from "../azure-service";
import { DaikonConverter } from "../daikon/daikon";
import { UploadJSON, StudyJSON, SeriesJSON, ImageJSON } from "../Objects";
import { BlobStorageUploader } from "./blobUploader";
import { Merger } from "./objectMerger";

export class UploadFiles {
    private uploads: UploadJSON[];
    private uploadID: number;
    private uploadDONE: boolean;
    private blobUploader: BlobStorageUploader;

    constructor() {
        this.uploads = [];
        this.uploadID = new Date().getTime();
        this.uploadDONE = false;
        this.blobUploader = new BlobStorageUploader(this.onDone);
        console.time('upload');
    }

    public handleFile = async (id: string) => {
        return new PromiseBB<boolean>(async (resolve, reject) => {
            await Controller.convertFile(id);
            let patient = await Controller.parse(id, this.uploadID);
            if (patient != null || patient != undefined) {
                try {
                    let successful = await this.blobUploader.upload(id, this.uploadDONE);
                    if (successful) {
                        this.uploads.push(patient);
                        resolve(true);
                    } else { resolve(false); }
                } catch (ee) {
                    resolve(false)
                } finally {
                    Controller.removeFiles(id);
                }
            } else {
                Controller.removeFiles(id);
            }

        });
    }

    public finish = () => {
        console.log("FINISH");
        this.uploadDONE = true;
        this.blobUploader.setUploadDone(this.uploadDONE);
    }

    public onDone = async () => {
        console.log("ON DONE");
        
        let patients = {};
        try {
            var db = await AzureDatabase.connect();
        } catch (error) {return;}

        let getPatients = this.uploads.map(async (patient) => {
            try {
                let patientAzure = await AzureDatabase.getPatientDocumentDB(patient.patientID, db);
                patients[patient.patientID] = patientAzure;
            } catch (error) {
                console.log("patientazure");
                console.log(error);
            }
        }, { concurrency: 5 });
        // w8 'till all patients are fetched
        await Promise.all(getPatients);

        //  merge fetched patients with current upload

        let newPatients = Merger.patientsMerger(patients, this.uploads);

        for (let key in newPatients) {
            console.log('inserting ' + key);
            await AzureDatabase.updateToImageCollectionDB(newPatients[key], db);
        }

        db.close();
        console.timeEnd('upload');
    }



}

export namespace Controller {

    export const convertFile = (id: string) => {
        return new PromiseBB(async (resolve, reject) => {
            try {
                await Converter.toPng(id);
                resolve();
            } catch (e) {
                reject();
            }
        });
    }


    export const parse = (id: string, uploadID: number) => {
        return new PromiseBB<UploadJSON>(async (resolve, reject) => {
            let converter = new DaikonConverter(storagePath + id);

            let patient = new UploadJSON();
            patient.patientID = converter.getPatientID();
            patient.patientName = converter.getPatientName();
            patient.patientBirthday = converter.getPatientDateOfBirth();

            let study = new StudyJSON();
            study.studyID = converter.getStudyInstanceUID();
            study.studyDescription = converter.getStudyDescription();

            let series = new SeriesJSON();
            series.seriesID = converter.getSeriesUID();
            series.seriesDescription = converter.getSeriesDescription();
            series.thumbnailImageID = id;
            let newImage: ImageJSON = {
                imageID: id,
                imageNumber: Number(converter.getImageNumber())
            };
            series.images.push(newImage);
            study.series.push(series);
            patient.studies.push(study);

            // check if image is in database
            let exists = await doesImageExistsInDb(patient.patientID,
                study.studyID,
                series.seriesID,
                newImage.imageNumber);
            //

            console.log(series.seriesID+" image number " + newImage.imageNumber+ " exists: "+exists);
            
            if (exists) resolve(null);

            //await AzureDatabase.insertToTemporeryPatients(uploadID,patient);
            resolve(patient);
        });

    }


    export const removeFiles = (id: string) => {
        fs.unlink(storagePath + id, (err) => { });
        fs.unlink(imagePath + id + ".png", () => { });
        console.log("[Deleting files] file: " + id + " OK ✔️");
    }

    interface ImageInfoData {
        patientID: string;
        study: string;
        series: string;
        imageID: string;
    }





    /*
        checks if image exists in db
    */
    const doesImageExistsInDb = (patientID: string, studyID: string,
        seriesID: string, imageNumber: number, ) => {
        return new PromiseBB(async (resolve, reject) => {
            let patientAzure = null;
            try {
                patientAzure = await AzureDatabase.getPatientDocument(patientID);
            } catch (err) {
                resolve(false);
            }

            if (notExists(patientAzure)) return resolve(false);
            let existingStudy = patientAzure.studies.find((stud) => {
                return stud.studyID === studyID;
            });

            if (notExists(existingStudy)) { return resolve(false); }
            let existingSeries = existingStudy.series.find((stud) => {
                return stud.seriesID === seriesID;
            });

            if (notExists(existingSeries)) { return resolve(false); }
            let existingImage = existingSeries.images.find((img) => {
                return img.imageNumber === imageNumber;
            });

            if (notExists(existingImage)) { return resolve(false); }
            return resolve(true);

        });
    }

    const notExists = (object: any) => {
        return (object == null || object == undefined);
    };
}