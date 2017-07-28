
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as lo from 'lodash';

import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { Converter } from '../../converter';
import { JSONCreator } from '../../Objects';
import { DaikonConverter } from '../../daikon/daikon';
import * as objects from '../../Objects';

export const rootUpload = '/upload';
export const routerUpload = express.Router();

let jsonCreator: JSONCreator = new JSONCreator();

/*
    Route:      OPTIONS '/upload'
    Expects:    
    --------------------------------------------
    Returns information about this endpoint.
*/
routerUpload.options('/', (req, res) => {
    return res.json(
        {
            endpoint: '/api/upload',
            message: 'Uploads is an endpoint for uploading series of DICOM images.'
        }
    );
});

// Middleware for extending the response's timeout for uploading larger files.
const extendTimeout = (req, res, next) => {
    res.setTimeout(60000, () => {
        res.sendStatus(StatusCode.GatewayTimeout);
    });
    next();
}

// Middleware of storage to the local folder for incoming files.
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    }
});
const storage = multer({ storage: storageConfig });

interface UploadResponse {
    upload_id: number;
    statuses: UploadStatus[];
}

interface UploadStatus {
    name: string;
    id: string;
    err: string;
}

interface ChainResponse extends UploadStatus {
    filename: string;
}

export class UploadController {
    public responses: ChainResponse[] = [];

    constructor() { }

    Root = async (req: express.Request, res: express.Response) => {
        // If none files were sent, respond with a BadRequest.
        if (req.files === undefined) { res.sendStatus(StatusCode.BadRequest); }

        // Convert, upload and parse the files.
        let files = req.files as Express.Multer.File[];
        await this.convert(files);
        await this.upload();
        let json = this.parse();

        // Cleanup.
        files.map((file) => {
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + ".png", () => {});
        });

        // Grab all ChainResponses and map them to UploadStatuses.
        let statuses: UploadStatus[] = this.responses.map((upload) => {
            return { name: upload.name, id: upload.id, err: upload.err };
        });
        // Then assign a unique_id and UploadStatuses to UploadResponse.
        let response: UploadResponse = {upload_id: json.uploadID, statuses: statuses};
        return response;
    }

    async convert(files: Express.Multer.File[]) {
        // Upload all the files from the request to the AzureStorage.
        const conversion = files.map(async (file) => {
            try {
                var response: ChainResponse = { name: file.originalname, id: null, err: null, filename: file.filename };
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
        // TODO: REFACTOR!!
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

/*
    Route:      POST '/upload'
    Middleware: extendTimeout, Multer storage, Root upload controller
    Expects:    Form-data
    --------------------------------------------
    Converts DICOM files to the PNG and uploads both formats to the Azure storage.
    Returns JSON, that cointains an array of names, id's 
    and if occured, errors of the converted files.
*/
routerUpload.post('/', extendTimeout, storage.any(), async (req: express.Request, res: express.Response) => {
    // Root upload controller, that takes care of conversion, uploading and parsing.
    let upload = new UploadController();
    let response = await upload.Root(req, res);
    // Return as JSON.
    res.json(
        {
            ...response
        }
    );
});

/*
    Route:      GET 'upload/:id'
    Expects:    
    --------------------------------------------
    Returns details about upload's id.
*/
routerUpload.get('/:id', async (req, res) => {
    if (req.params.id == 12345) {
        let responseJSON = jsonCreator.getUploadJSON();
        console.log("test json", responseJSON);
        res.json(responseJSON);
    } else if (req.params.id == 222) {
        //let responseJSON = await AzureDatabase.getLastUpload();
        let responseJSON = await AzureDatabase.getUploadDocument(1501233911290.0);
        console.log("azure json", responseJSON);
        res.json(responseJSON);
    } else {
        res.json({ status: "INVALID UPLOAD ID" });
    }
});

/*
    Mock route for testing the upload to MongoDB
    Route:      POST 'upload/document'
    Expects:    
    --------------------------------------------
    Returns details about upload.
*/
//routerUpload.post('/document', (req, res) => {
routerUpload.post('/document', extendTimeout, storage.array('data'), async (req, res) => {
    /*
    let upload: AzureDatabase.Upload = {
        uploadID: new Date().getTime(),
        uploadDate: new Date(),
        studies: [{
            patientName: "Abracadabra",
            patientBirthday: new Date().getTime(),
            series: [{
                seriesID: "04",
                seriesDescription: "KOLENO",
                images: ["image01", "image04", "image06"],
                thumbnailImageID: "image04"
            }, {
                seriesID: "02",
                seriesDescription: "MOZOG",
                images: ["image02", "image03"],
                thumbnailImageID: "image02"
            }],
            studyDescription: "This is study01 descripotion",
            studyID: "studyID 01"
        }, {
            patientName: "Ice King",
            patientBirthday: new Date().getTime(),
            series: [{
                seriesID: "10",
                seriesDescription: "chrbatik",
                images: ["image05"],
                thumbnailImageID: "image05"
            }],
            studyDescription: "This study is about somthing very important",
            studyID: "studyID is 02"
        }]
    }
    */
    

    // Upload the document to MongoDB
    //await AzureDatabase.insertDocument(upload);

    // Get documents based on the query
    //var query = { patientName: "Hana Hahhahah" };
    //let result = await AzureDatabase.getDocuments(query);
    let result = await AzureDatabase.getUploadDocument(1501233911290.0);
    //console.log(result);
    res.json(result);
    
});
