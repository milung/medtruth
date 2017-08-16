
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
        await AzureDatabase.insertToImagesCollection(json);
        await createThumbnails;

        // Cleanup.
        files.forEach((file) => {
            console.log("[Deleting files] file: " + file.path);
            fs.unlink(file.path, () => { });
            console.log("[Deleting files] image: " + file.filename);
            fs.unlink(imagePath + file.filename + ".png", () => { });
            console.log("[Deleting files] file: " + file.filename + " OK ✔️");
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
        // TODO: Refactor!
        
        let json = {uploadID: "123"};
        //json.uploadID = new Date().getTime();
        //json.uploadDate = new Date();
        let studiesArray: Image[][][] = [];

        return json;
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


    createThumbnail(imageID){
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