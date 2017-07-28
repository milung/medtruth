
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { Converter } from '../../converter';
import { JSONCreator } from '../../Objects';

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

/*
    Route:      POST '/upload'
    Middleware: extendTimeout, Multer storage
    Expects:    Form-data
    --------------------------------------------
    Converts DICOM files to the PNG and uploads both formats to the Azure storage.
    Returns JSON, that cointains ID's of the converted files.
*/
interface UploadMessage {
    name: string;
    id: string;
    err: string;
}

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

// Middleware of converting the files to an image.
const converter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // If files are undefined, send a BadRequest.
    if (req.files === undefined) {
        res.sendStatus(StatusCode.BadRequest);
    }

    // Keep track of all the files converted
    // and if any error happened, append it along the way.
    const files = req.files as Express.Multer.File[];
    // Upload all the files from the request to the AzureStorage.
    const uploads = files.map(async (file) => {
        try {
            var upload = Object.assign({}, file, { name: file.originalname as string, id: null as string, err: null as string });
            await Converter.toPng(upload.filename);
        } catch (e) {
            if (e === Converter.Status.FAILED) {
                upload.err = "Conversion Error";
            }
        } finally {
            return upload;
        }
    });
    // Wait for all conversions.
    Promise.all(uploads).then((uploads) => {
        req.params.uploads = uploads;
        next();
    });
}

// Middleware of uploading the files to Azure.
const uploader = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Iterate over conversions and send them to the Azure.
    const uploads = req.params.uploads.map(async (upload) => {
        try {
            // If an error occured during conversion, don't send the file.
            if (upload.err) { return; }
            // Else upload the DICOM and PNG.
            await AzureStorage.toDicoms(
                upload.filename,
                upload.path);
            await AzureStorage.toImages(
                upload.filename + ".png",
                imagePath + upload.filename + ".png");
            // Assign the upload id to this file.
            upload.id = upload.filename;
        } catch (e) {
            if (e === AzureStorage.Status.FAILED) {
                upload.err = "Storage Error";
            }
        } finally {
            return upload;
        }
    });
    Promise.all(uploads).then((uploads) => {
        req.params.uploads = uploads;
        next();
    });
}

routerUpload.post('/',
    extendTimeout,
    storage.any(),
    converter,
    uploader,
    (req: any, res) => {
        let statuses: UploadMessage[] = req.params.uploads.map((upload) => { 
            fs.unlink(upload.path, () => { });
            fs.unlink(imagePath + upload.filename + ".png", () => { });
            return { name: upload.name, id: upload.id, err: upload.err } 
        });
        res.json(
            {
                statuses
            }
        );
    });

/*
    Route:      GET 'upload/:id'
    Expects:    
    --------------------------------------------
    Returns details about upload's id.
*/
routerUpload.get('/:id', (req, res) => {
    if (req.params.id == 12345) {
        let responseJSON = jsonCreator.getUploadJSON();
        res.json(responseJSON); }
    else if (req.params.id == 0) {
        let responseJSON = AzureDatabase.getLastUpload();
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
    // const files = req.files as Express.Multer.File[];
    // console.log(req.body);

    // let file = files[0];
    // console.log(file);
    // console.log(file.buffer);
    // let responseJSON = await AzureDatabase.insertObject(files[0]);
    // res.json(responseJSON);


    // let responseJSON;
    // files.map(async (file) => {
    //     responseJSON = AzureDatabase.insertObject(file);
    // });
    // res.json(responseJSON);

    // let img: AzureDatabase.Image = {
    //     seriesID: "skfalfslanfas",
    //     patientName: "Hana Hahhahah",
    //     imageID: "sadd297nsdjan31 239729 adskaj",
    //     date: new Date(),
    //     uploadDate: new Date(),
    //     uploadID: new Date().getTime(),
    //     thumbnails: [{ name: "00614ad28b6d7b1628cc208c4d328b99" }, { name: "ksakdahsldjsda" }]
    // }

    let upload: AzureDatabase.Upload = {
        uploadID: new Date().getTime(),
        uploadDate: new Date(),
        studies: [{
            patientName: "Abracadabra",
            patientBirthday: new Date().getMilliseconds(),
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
            }]
        }, {
            patientName: "Ice King",
            patientBirthday: new Date().getMilliseconds(),
            series: [{
                seriesID: "10",
                seriesDescription: "chrbatik",
                images: ["image05"],
                thumbnailImageID: "image05"
            }]
        }]
    }

    // Upload the document to MongoDB
    await AzureDatabase.insertDocument(upload);

    // Get documents based on the query
    //var query = { patientName: "Hana Hahhahah" };
    //let result = await AzureDatabase.getDocuments(query);
    let result = await AzureDatabase.getLastUpload();
    //console.log(result);
    res.json(result);
});
