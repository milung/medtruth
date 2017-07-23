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
var converter = require("./dcmtk/dcmj2pnm");
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
    res.setTimeout(480000, function () {
        res.sendStatus(constants_1.StatusCode.GatewayTimeout).end();
    });
    next();
};
/*
    Route:       POST '/_upload'.
    Middleware:  extendTimeout, Multer array of data.
    Expects:     Form-data, containing files.
    -----------------------------------------------------------------------
    Saves incoming files to the 'uploadsPath' folder.
    Files HAVE TO contain a header: 'Content-Type': 'multipart/form-data'.
    Files are sent to the Azure Storage and converted to the PNG format.
*/
server.post('/_upload', extendTimeout, storage.array('data'), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var files, uploads;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = req.files;
                uploads = files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                    var msg1, msg2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new converter.Dcmj2pnm().convertToPng(file.path, 'sample.png', function (p, s) { return s; })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, azure_service_1.AzureStorage.upload(azure_service_1.AzureStorage.containerImages, 'sample.png', 'images/sample.png')];
                            case 2:
                                msg1 = _a.sent();
                                return [4 /*yield*/, azure_service_1.AzureStorage.upload(azure_service_1.AzureStorage.containerDicoms, file.filename, file.path)];
                            case 3:
                                msg2 = _a.sent();
                                fs.unlink(file.path, function () { });
                                // fs.unlink('images/sample.png', () => {});
                                return [2 /*return*/, msg1 + msg2];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(uploads)];
            case 1:
                _a.sent();
                res.sendStatus(constants_1.StatusCode.OK).end();
                return [2 /*return*/];
        }
    });
}); });
/*
    Route:      GET '/_images'
    Expects:
    --------------------------------------------
    Returns all PNG images to the client.
*/
server.get('/_images', function (req, res) {
    fs.readFile("images/sample.png", function (err, data) {
        if (err) {
            res.sendStatus(constants_1.StatusCode.InternalServerError).end();
        }
        res.statusCode = constants_1.StatusCode.OK;
        res.send(constants_1.base64png + new Buffer(data).toString('base64')).end();
    });
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
server.get('_images/:id', function (req, res) {
    res.sendStatus(constants_1.StatusCode.NotImplemented).end();
});
// Listen and serve.
var port = 8080;
server.listen(port, function () {
    console.log("Listening on port", port);
});
