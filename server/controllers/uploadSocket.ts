import * as fs from 'fs';
import { storagePath, imagePath } from "../constants";
import { Converter } from "../converter";
import * as PromiseBB from 'bluebird';
import { AzureDatabase, AzureStorage } from "../azure-service";
import { DaikonConverter } from "../daikon/daikon";
import { UploadJSON, StudyJSON, SeriesJSON, ImageJSON, TerminatedUpload } from "../Objects";
import { BlobStorageUploader } from "./blobUploader";
import { Merger } from "../merger/objectMerger";

export class UploadFiles {
    private uploads: UploadJSON[];
    private uploadID: number;
    private uploadDONE: boolean;
    private uploadTerminated: boolean;
    private blobUploader: BlobStorageUploader;
    private filesToDelete: string[];

    constructor() {
        this.uploads = [];
        this.filesToDelete = [];
        this.uploadID = new Date().getTime();
        this.uploadDONE = false;
        this.uploadTerminated = false;
        this.blobUploader = new BlobStorageUploader(this.onDone);
        console.time('upload');
    }

    public handleFile = async (id: string) => {
        return new PromiseBB<FileStatus>(async (resolve, reject) => {
            // wait until file is converted to png
            try {
                await Controller.convertFile(id);
            } catch (e) {
                this.blobUploader.decrementUploadCounter();
                Controller.removeFiles(id);
                resolve(FileStatus.CONVERTION_FAIL);
                return;
            }
            // parse file
            try {
                let patient = await Controller.parse(id);
                if (patient != null || patient != undefined) {
                    try {
                        let successful = await this.blobUploader.upload(id, this.uploadDONE);
                        if (successful) {
                            this.uploads.push(patient);
                            resolve(FileStatus.OK);
                        } else { resolve(FileStatus.AZURE_STORAGE_FAIL); }
                    } catch (error) {
                        this.blobUploader.decrementUploadCounter();
                        resolve(FileStatus.AZURE_STORAGE_FAIL);
                        console.log(error);
                    } finally {
                        Controller.removeFiles(id);
                    }
                } else {
                    this.blobUploader.decrementUploadCounter();
                    Controller.removeFiles(id);
                    resolve(FileStatus.FILE_ALREADY_EXISTS);
                }

            } catch (err) {
                this.blobUploader.decrementUploadCounter();
                Controller.removeFiles(id);
                resolve(FileStatus.DATABASE_CONNECTION_FAIL);
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
        // if upload was terminated and dodnt finish properly
        if (this.uploadTerminated && !this.uploadDONE) {
            this.instertToTerminatedUpload();
        } else {
            Merger.mergePatientsToDB(this.uploads);
        }
    }

    public async instertToTerminatedUpload() {
        console.log("instertToTerminatedUpload");
        
        let upload: TerminatedUpload = new TerminatedUpload();
        upload._id = this.uploadID;
        upload.patients = this.uploads;
        
        try{
            let patientAzure = await AzureDatabase.insertToTerminatedUpload(upload);
            console.log("instertToTerminatedUpload DONE");
        }catch(er){
            console.log('error insterting to temrinated uploads');
            console.log(er);
            
        }
        
    }

    public incrementUploadCounter() {
        this.blobUploader.incrementUploadCounter();
    }

    public decrementUploadCounter() {
        this.blobUploader.decrementUploadCounter();
    }

    public getFilesTodelete(): string[] {
        return this.filesToDelete;
    }

    public setUploadTerminated() {
        this.uploadTerminated = true;
        this.blobUploader.setUploadTerminated();
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


    export const parse = (id: string) => {
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
            try {
                let exists = await doesImageExistsInDb(patient.patientID,
                    study.studyID,
                    series.seriesID,
                    newImage.imageNumber);
                console.log(series.seriesID + " image number " + newImage.imageNumber + " exists: " + exists);

                if (exists) resolve(null);
                resolve(patient);
            } catch (err) {
                reject();
            }

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
                reject();
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

export interface UploadStatus {
    fileName: string;
    id: string;
    fileStatus: FileStatus;
}

export enum FileStatus {
    OK,
    CONVERTION_FAIL,
    FILE_ALREADY_EXISTS,
    AZURE_STORAGE_FAIL,
    DATABASE_CONNECTION_FAIL
}