
import * as express from 'express';
import * as fs from 'fs';

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

export class UploadController {
    public responses: ChainStatus[] = [];

    constructor() {
        this.Root = this.Root.bind(this);
        this.convert = this.convert.bind(this);
        this.upload = this.upload.bind(this);
        this.parse = this.parse.bind(this);
    }

    Root = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let files = req.files as Express.Multer.File[];

        // If none or zero files were sent, respond with a BadRequest.
        if (files === undefined) { next(); return null; }
        if (files.length === 0) { next(); return null; }

        // Convert, upload and parse the files.
        await this.convert(files);
        await this.upload();
        let json = this.parse();

        await AzureDatabase.insertDocument(json);

        // Cleanup.
        files.forEach((file) => {
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + ".png", () => {});
        });

        // Grab all ChainStatuses and map them to UploadStatuses.
        let statuses: UploadStatus[] = this.responses.map((upload) => {
            return { name: upload.name, id: upload.id, err: upload.err };
        });
        // Then assign a unique_id and UploadStatuses.
        req.params.statuses = {upload_id: json.uploadID, statuses: statuses};
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

    parse() {
        // TODO: Refactor!
        let json = new objects.UploadJSON();
        json.uploadID = new Date().getTime();
        json.uploadDate = json.uploadID;

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
            }
            existingStudy.studyID = converter.getStudyInstanceUID();
            existingStudy.studyDescription = converter.getStudyDescription();
            existingStudy.patientBirthday = -1;
            existingStudy.patientName = converter.getPatientName();


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
            existingSeries.thumbnailImageID = parse.filename;
            existingSeries.images.push(parse.filename);

            if (!seriesFound) {
                existingStudy.series.push(existingSeries);
            }

            if (!studyFound) {
                json.studies.push(existingStudy);
            }
        });
        return json;
    }
}