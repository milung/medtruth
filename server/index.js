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
var express = require("express");
var multer = require("multer");
var fs = require("fs");
var constants_1 = require("./constants");
var azure_service_1 = require("./azure-service");
var converter_1 = require("./converter");
// Set-up a server, that automatically serves static files.
var server = express();
server.use(express.static('public/'));
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
        res.sendStatus(constants_1.StatusCode.GatewayTimeout).end();
    });
    next();
};
server.post('/_upload', extendTimeout, storage.array('data'), function (req, res) {
    var files = req.files;
    // Upload all the files to the AzureStorage.
    var uploads = files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var convert, uploadDicom, uploadPng, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    convert = converter_1.Converter.toPng(file.filename);
                    uploadDicom = azure_service_1.AzureStorage.toDicoms(file.filename, file.path);
                    // Before proceeding to upload PNG to Azure, make sure to convert first.
                    return [4 /*yield*/, convert];
                case 1:
                    // Before proceeding to upload PNG to Azure, make sure to convert first.
                    _a.sent();
                    uploadPng = azure_service_1.AzureStorage.toImages(file.filename + '.png', constants_1.imagePath + file.filename + '.png');
                    // Await for uploading, if necessary.
                    return [4 /*yield*/, uploadDicom];
                case 2:
                    // Await for uploading, if necessary.
                    _a.sent(), uploadPng;
                    // Remove files from the local storage.
                    fs.unlink(file.path, function () { });
                    fs.unlink(constants_1.imagePath + file.filename + '.png', function () { });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Something got wrong", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, true];
            }
        });
    }); });
    Promise.all(uploads).then(function () {
        console.log(files[0].filename);
        res.json({
            images_id: [files.map(function (file) { return file.filename; })]
        }).end();
    });
});
/*
    Route:      GET '/_images'
    Expects:
    --------------------------------------------
    Returns all PNG images to the client.
*/
server.get('/_images', function (req, res) {
    res.sendStatus(constants_1.StatusCode.OK).end();
});
/*
    Route:      GET '/_images/latest'
    Expects:    JSON, containing number of latest images.
    --------------------------------------------
    Returns latest PNG images uploaded to the server.
*/
server.get('/_images/latest', function (req, res) {
    res.sendStatus(constants_1.StatusCode.NotImplemented).end();
});
/*
    Route:      GET '/_images/:id'
    Expects:    JSON, containing an id of an image.
    --------------------------------------------
    Returns a PNG image by id.
*/
server.get('/_images/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var id, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id + ".png";
                return [4 /*yield*/, azure_service_1.AzureStorage.getURLforImage(id)];
            case 1:
                url = _a.sent();
                res.send(url).end();
                return [2 /*return*/];
        }
    });
}); });
// Listen and serve.
var port = 8080;
server.listen(port, function () {
    console.log("Listening on port", port);
});
