
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

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

const parser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let json = new objects.UploadJSON();
    json.uploadID = new Date().getTime();
    json.uploadDate = json.uploadID;

    let uploads = req.params.uploads.map((upload) => {
        if (upload.err) { return; }
        let converter = new DaikonConverter(upload.path);
        let study = new objects.StudyJSON();
        study.studyID = converter.getStudyInstanceUID();
        study.studyDescription = converter.getStudyDescription();
        study.patientBirthDay = converter.getPatientDateOfBirth().getTime();
        study.patientName = converter.getPatientName();

        let series = new objects.SeriesJSON();
        series.seriesDescription = converter.getSeriesDescription();
        series.seriesID = converter.getSeriesUID();
        series.images.push(imagePath + upload.filename);
        study.series.push(series);
        json.studies.push(study);
    });

    req.params.json = json;
    next();
}

routerUpload.post('/',
    extendTimeout,
    storage.any(),
    converter,
    uploader,
    parser,
    (req: any, res) => {
        /*
        let statuses: UploadMessage[] = req.params.uploads.map((upload) => { 
            fs.unlink(upload.path, () => { });
            fs.unlink(imagePath + upload.filename + ".png", () => { });
            return { name: upload.name, id: upload.id, err: upload.err } 
        });
        */
        res.json(
            {
                asd: req.params.json
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

    /*
    let upload: AzureDatabase.Upload = {
        uploadID: new Date().getTime(),
        uploadDate: new Date(),
        studies: [{
            patientName: "Abracadabra",
            patientBirthday: new Date(),
            series: [{
                seriesID: "01",
                seriesDescription: "KOLENO",
                images: ["image01", "image04", "image06"]
            }, {
                seriesID: "02",
                seriesDescription: "MOZOG",
                images: ["image02", "image03"]
            }]
        }, {
            patientName: "Ice King",
            patientBirthday: new Date(),
            series: [{
                seriesID: "05",
                seriesDescription: "chrbatik",
                images: ["image05"]
            }]
        }]
    }

    // Upload the document to MongoDB
    await AzureDatabase.insertDocument(upload);

    // Get documents based on the query
    var query = { patientName: "Hana Hahhahah" };
    let result = await AzureDatabase.getDocuments(query);
    //console.log(result);
    res.json(result);
    */
});
