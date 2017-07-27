"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var express_1 = require("express");
var multer = require("multer");
var fs = require("fs");
var constants_1 = require("../../constants");
var azure_service_1 = require("../../azure-service");
var converter_1 = require("../../converter");
var Objects_1 = require("../../Objects");
exports.rootUpload = '/_upload';
exports.routerUpload = express_1.Router();
var jsonCreator = new Objects_1.JSONCreator();
// Set-up a storage to the local folder for incoming files.
var storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, constants_1.storagePath);
    }
});
var storage = multer({ storage: storageConfig });
// Extend the response's timeout for uploading larger files.
var extendTimeout = function (req, res, next) {
    res.setTimeout(60000, function () {
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
exports.routerUpload.options('/', function (req, res) {
    return res.json({
        endpoint: '/api/_upload',
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
exports.routerUpload.post('/', extendTimeout, storage.array('data'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var files, uploads;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = req.files;
                uploads = files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                    var upload, conversion, uploadingDicom, uploadingImage, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, 4, 5]);
                                upload = { name: file.originalname };
                                conversion = converter_1.Converter.toPng(file.filename);
                                uploadingDicom = azure_service_1.AzureStorage.toDicoms(file.filename, file.path);
                                // Before proceeding to upload PNG to Azure, make sure to convert first.
                                return [4 /*yield*/, conversion];
                            case 1:
                                // Before proceeding to upload PNG to Azure, make sure to convert first.
                                _a.sent();
                                uploadingImage = azure_service_1.AzureStorage.toImages(file.filename + '.png', constants_1.imagePath + file.filename + '.png');
                                // Await for uploads, if necessary.
                                return [4 /*yield*/, uploadingDicom];
                            case 2:
                                // Await for uploads, if necessary.
                                _a.sent(), uploadingImage;
                                upload.id = file.filename;
                                return [3 /*break*/, 5];
                            case 3:
                                e_1 = _a.sent();
                                if (e_1 === converter_1.Converter.Status.FAILED) {
                                    upload.err = 'Conversion Error';
                                }
                                else if (e_1 === azure_service_1.AzureStorage.Status.FAILED) {
                                    upload.err = 'Storage Error';
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                // Remove both formats from the local storage.
                                fs.unlink(file.path, function () { });
                                fs.unlink(constants_1.imagePath + file.filename + '.png', function () { });
                                return [7 /*endfinally*/];
                            case 5: return [2 /*return*/, upload];
                        }
                    });
                }); });
                // Wait for all upload promises.
                return [4 /*yield*/, Promise.all(uploads).then(function (uploads) {
                        res.json({
                            statuses: uploads.slice()
                        });
                    })];
            case 1:
                // Wait for all upload promises.
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/*
    Route:      GET '_upload:id'
    Expects:
    --------------------------------------------
    Returns detalis about upload.
*/
exports.routerUpload.get('/:id', function (req, res) {
    if (req.params.id == 12345) {
        var responseJSON = jsonCreator.getUploadJSON();
        res.json(responseJSON);
    }
    else {
        res.json({ status: "INVALID UPLOAD ID" });
    }
});
