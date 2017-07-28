"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const constants_1 = require("../../constants");
const azure_service_1 = require("../../azure-service");
const converter_1 = require("../../converter");
const Objects_1 = require("../../Objects");
const daikon_1 = require("../../daikon/daikon");
const objects = require("../../Objects");
exports.rootUpload = '/upload';
exports.routerUpload = express.Router();
let jsonCreator = new Objects_1.JSONCreator();
/*
    Route:      OPTIONS '/upload'
    Expects:
    --------------------------------------------
    Returns information about this endpoint.
*/
exports.routerUpload.options('/', (req, res) => {
    return res.json({
        endpoint: '/api/upload',
        message: 'Uploads is an endpoint for uploading series of DICOM images.'
    });
});
// Middleware for extending the response's timeout for uploading larger files.
const extendTimeout = (req, res, next) => {
    res.setTimeout(60000, () => {
        res.sendStatus(constants_1.StatusCode.GatewayTimeout);
    });
    next();
};
// Middleware of storage to the local folder for incoming files.
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, constants_1.storagePath);
    }
});
const storage = multer({ storage: storageConfig });
class UploadController {
    constructor() {
        this.responses = [];
        this.Root = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // If none files were sent, respond with a BadRequest.
            if (req.files === undefined) {
                res.sendStatus(constants_1.StatusCode.BadRequest);
            }
            // Convert, upload and parse the files.
            let files = req.files;
            yield this.convert(files);
            yield this.upload();
            this.parse();
            // Cleanup.
            files.map((file) => {
                fs.unlink(file.path, () => { });
                fs.unlink(constants_1.imagePath + file.filename + ".png", () => { });
            });
            return this.responses;
        });
    }
    convert(files) {
        return __awaiter(this, void 0, void 0, function* () {
            // Upload all the files from the request to the AzureStorage.
            const conversion = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                try {
                    var response = { name: file.originalname, id: null, err: null, filename: file.filename };
                    yield converter_1.Converter.toPng(file.filename);
                }
                catch (e) {
                    // If anything happened during conversion, assign an error to the response.
                    response.err = "Conversion Error";
                }
                return response;
            }));
            // Await for all conversions.
            this.responses = yield Promise.all(conversion);
        });
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            // Iterate over conversions and send them to the Azure.
            const uploads = this.responses.map((upload) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (upload.err)
                        return upload;
                    // Else upload the DICOM and PNG.
                    yield azure_service_1.AzureStorage.toDicoms(upload.filename, constants_1.storagePath + upload.filename);
                    yield azure_service_1.AzureStorage.toImages(upload.filename + ".png", constants_1.imagePath + upload.filename + ".png");
                    // Assign the upload id to this file.
                    upload.id = upload.filename;
                }
                catch (e) {
                    // If anything happened during uploading, assign an error to the response.
                    upload.err = "Storage Error";
                }
                return upload;
            }));
            // Await for all uploads.
            this.responses = yield Promise.all(uploads);
        });
    }
    parse() {
        // TODO: REFACTOR!!
        let json = new objects.UploadJSON();
        json.uploadID = new Date().getTime();
        json.uploadDate = json.uploadID;
        let parses = this.responses.forEach((parse) => {
            if (parse.err)
                return;
            let converter = new daikon_1.DaikonConverter(constants_1.storagePath + parse.filename);
            let studyID = converter.getStudyInstanceUID();
            let studyFound = true;
            let seriesFound = true;
            let existingStudy = json.studies.find((stud) => {
                return stud.studyID === studyID;
            });
            if (existingStudy === undefined) {
                studyFound = false;
                existingStudy = new objects.StudyJSON();
            }
            existingStudy.studyID = converter.getStudyInstanceUID();
            existingStudy.studyDescription = converter.getStudyDescription();
            existingStudy.patientBirthDay = converter.getPatientDateOfBirth();
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
exports.UploadController = UploadController;
/*
    Route:      POST '/upload'
    Middleware: extendTimeout, Multer storage, Root upload controller
    Expects:    Form-data
    --------------------------------------------
    Converts DICOM files to the PNG and uploads both formats to the Azure storage.
    Returns JSON, that cointains an array of names, id's
    and if occured, errors of the converted files.
*/
exports.routerUpload.post('/', extendTimeout, storage.any(), (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Root upload controller, that takes care of conversion, uploading and parsing.
    let upload = new UploadController();
    let uploads = yield upload.Root(req, res);
    // Map the responses from the Root.
    let statuses = uploads.map((upload) => {
        return { name: upload.name, id: upload.id, err: upload.err };
    });
    // Return as JSON.
    res.json({
        statuses
    });
}));
/*
    Route:      GET 'upload/:id'
    Expects:
    --------------------------------------------
    Returns details about upload's id.
*/
exports.routerUpload.get('/:id', (req, res) => {
    if (req.params.id == 12345) {
        let responseJSON = jsonCreator.getUploadJSON();
        res.json(responseJSON);
    }
    else {
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
exports.routerUpload.post('/document', extendTimeout, storage.array('data'), (req, res) => __awaiter(this, void 0, void 0, function* () {
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
}));
//# sourceMappingURL=upload.js.map