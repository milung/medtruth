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
exports.__esModule = true;
var azure = require("azure-storage");
// import * as mongo from 'mongodb';
var AzureStorage;
(function (AzureStorage) {
    var accountName = 'medtruth';
    var accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    var blobService = azure.createBlobService(accountName, accountKey);
    AzureStorage.containerDicoms = 'dicoms';
    AzureStorage.containerImages = 'images';
    function upload(container, blobName, filePath) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, blobService.createBlockBlobFromLocalFile(container, blobName, filePath, function (error, result, response) {
                            var message = "Created: " + result.name + ", exists: " + result.exists + ", is successful: " + response.isSuccessful;
                            if (!error) {
                                resolve(message);
                            }
                            else {
                                reject(message);
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    AzureStorage.upload = upload;
    function toDicoms(blobName, filePath) {
        return upload(AzureStorage.containerDicoms, blobName, filePath);
    }
    AzureStorage.toDicoms = toDicoms;
    function toImages(blobName, filePath) {
        return upload(AzureStorage.containerImages, blobName, filePath);
    }
    AzureStorage.toImages = toImages;
    function getURLforImage(image) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var startDate, expiryDate, sharedAccessPolicy, token, sasUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = new Date();
                        expiryDate = new Date(startDate);
                        expiryDate.setMinutes(startDate.getMinutes() + 10);
                        startDate.setMinutes(startDate.getMinutes() - 10);
                        sharedAccessPolicy = {
                            AccessPolicy: {
                                Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                                Start: startDate,
                                Expiry: expiryDate
                            }
                        };
                        return [4 /*yield*/, blobService.generateSharedAccessSignature(AzureStorage.containerImages, image, sharedAccessPolicy)];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, blobService.getUrl(AzureStorage.containerImages, image, token)];
                    case 2:
                        sasUrl = _a.sent();
                        resolve(sasUrl);
                        return [2 /*return*/];
                }
            });
        }); });
    }
    AzureStorage.getURLforImage = getURLforImage;
})(AzureStorage = exports.AzureStorage || (exports.AzureStorage = {}));
