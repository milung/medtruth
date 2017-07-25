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
exports.rootUpload = '/_upload';
exports.routerUpload = express_1.Router();
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
        res.sendStatus(constants_1.StatusCode.GatewayTimeout).end();
    });
    next();
};
exports.routerUpload.post('/', extendTimeout, storage.array('data'), (req, res) => __awaiter(this, void 0, void 0, function* () {
    const files = req.files;
    // Upload all the files to the AzureStorage.
    const uploads = files.map((file) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Convert and upload DICOM to Azure asynchronously.
            let convert = converter_1.Converter.toPng(file.filename);
            let uploadDicom = azure_service_1.AzureStorage.toDicoms(file.filename, file.path);
            // Before proceeding to upload PNG to Azure, make sure to convert first.
            yield convert;
            let uploadPng = azure_service_1.AzureStorage.toImages(file.filename + '.png', constants_1.imagePath + file.filename + '.png');
            // Await for uploading, if necessary.
            yield uploadDicom, uploadPng;
        }
        catch (e) {
            console.error("Something got wrong", e);
        }
        finally {
            // Remove files from the local storage.
            fs.unlink(file.path, () => { });
            fs.unlink(constants_1.imagePath + file.filename + '.png', () => { });
        }
        return true;
    }));
    // For all successed promises, send a JSON response.
    yield Promise.all(uploads);
    res.json({
        images_id: [files.map((file) => { return file.filename; })]
    }).end();
}));
//# sourceMappingURL=upload.js.map