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
const express_1 = require("express");
const multer = require("multer");
const fs = require("fs");
const constants_1 = require("../../constants");
const azure_service_1 = require("../../azure-service");
const converter_1 = require("../../converter");
const Objects_1 = require("../../Objects");
exports.rootUpload = '/upload';
exports.routerUpload = express_1.Router();
let jsonCreator = new Objects_1.JSONCreator();
// Set-up a storage to the local folder for incoming files.
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, constants_1.storagePath);
    }
});
const storage = multer({ storage: storageConfig });
// Extend the response's timeout for uploading larger files.
const extendTimeout = (req, res, next) => {
    res.setTimeout(60000, () => {
        res.sendStatus(constants_1.StatusCode.GatewayTimeout);
    });
    next();
};
/*
    Route:      OPTIONS '/_uploads'
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
/*
    Route:      POST '/_upload'
    Middleware: extendTimeout, Multer storage
    Expects:    Form-data
    --------------------------------------------
    Converts DICOM files to the PNG and uploads both formats to the Azure storage.
    Returns JSON, that cointains ID's of the converted files.
*/
exports.routerUpload.post('/', extendTimeout, storage.array('data'), (req, res) => __awaiter(this, void 0, void 0, function* () {
    // Keep track of all the files converted
    // and if any error happened, append it along the way.
    const files = req.files;
    // Upload all the files from the request to the AzureStorage.
    const uploads = files.map((file) => __awaiter(this, void 0, void 0, function* () {
        try {
            var upload = { name: file.originalname, id: null, err: null };
            // Convert and upload DICOM to Azure asynchronously.
            let conversion = converter_1.Converter.toPng(file.filename);
            let uploadingDicom = azure_service_1.AzureStorage.toDicoms(file.filename, file.path);
            // Before proceeding to upload PNG to Azure, make sure to convert first.
            yield conversion;
            let uploadingImage = azure_service_1.AzureStorage.toImages(file.filename + '.png', constants_1.imagePath + file.filename + '.png');
            // Await for uploads, if necessary.
            yield uploadingDicom, uploadingImage;
            // Assign the upload's id.
            upload.id = file.filename;
        }
        catch (e) {
            // Assign errors for each case of exception.
            if (e === converter_1.Converter.Status.FAILED) {
                upload.err = 'Conversion Error';
            }
            else if (e === azure_service_1.Status.FAILED) {
                upload.err = 'Storage Error';
            }
        }
        finally {
            // Remove both formats from the local storage.
            fs.unlink(file.path, () => { });
            fs.unlink(constants_1.imagePath + file.filename + '.png', () => { });
        }
        return upload;
    }));
    // Wait for all upload promises.
    yield Promise.all(uploads).then((uploads) => {
        res.json({
            statuses: uploads.slice()
        });
    });
}));
/*
    Route:      GET '_upload:id'
    Expects:
    --------------------------------------------
    Returns details about upload.
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
    Route:      POST '_upload/document'
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
    // Upload the document from the request to MongoDB
    // let responseJSON;
    // files.map(async (file) => {
    //     responseJSON = AzureDatabase.insertObject(file);
    // });
    // res.json(responseJSON);
    let img = {
        seriesID: "skfalfslanfas",
        patientName: "Hana Hahhahah",
        imageID: "sadd297nsdjan31 239729 adskaj",
        date: new Date(),
        uploadDate: new Date(),
        uploadID: new Date().getTime(),
        thumbnail: "00614ad28b6d7b1628cc208c4d328b99"
    };
    let responseJSON = yield azure_service_1.AzureDatabase.insertObject(img);
    res.json(responseJSON);
}));
//# sourceMappingURL=upload.js.map