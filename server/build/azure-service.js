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
const azure = require("azure-storage");
// import * as mongo from 'mongodb';
var AzureStorage;
(function (AzureStorage) {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    const blobService = azure.createBlobService(accountName, accountKey);
    AzureStorage.containerDicoms = 'dicoms';
    AzureStorage.containerImages = 'images';
    function upload(container, blobName, filePath) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield blobService.createBlockBlobFromLocalFile(container, blobName, filePath, (error, result, response) => {
                let message = "Created: " + result.name + ", exists: " + result.exists + ", is successful: " + response.isSuccessful;
                if (!error) {
                    resolve(message);
                }
                else {
                    reject(message);
                }
            });
        }));
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var startDate = new Date();
            var expiryDate = new Date(startDate);
            startDate.setMinutes(startDate.getMinutes() - 10);
            expiryDate.setMinutes(startDate.getMinutes() + 10);
            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Start: startDate,
                    Expiry: expiryDate
                },
            };
            var token = yield blobService.generateSharedAccessSignature(AzureStorage.containerImages, image, sharedAccessPolicy);
            var sasUrl = yield blobService.getUrl(AzureStorage.containerImages, image, token);
            resolve(sasUrl);
        }));
    }
    AzureStorage.getURLforImage = getURLforImage;
})(AzureStorage = exports.AzureStorage || (exports.AzureStorage = {}));
//# sourceMappingURL=azure-service.js.map