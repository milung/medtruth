"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const azure = require("azure-storage");
const request = require("request");
// import * as mongo from 'mongodb';
const constants_1 = require("./constants");
var AzureStorage;
(function (AzureStorage) {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    AzureStorage.blobService = azure.createBlobService(accountName, accountKey);
    AzureStorage.containerDicoms = 'dicoms';
    AzureStorage.containerImages = 'images';
    let Status;
    (function (Status) {
        Status[Status["SUCCESFUL"] = 0] = "SUCCESFUL";
        Status[Status["FAILED"] = 1] = "FAILED";
    })(Status = AzureStorage.Status || (AzureStorage.Status = {}));
    function upload(container, blobName, filePath) {
        return new Promise((resolve, reject) => {
            AzureStorage.blobService.createBlockBlobFromLocalFile(container, blobName, filePath, (error, result, response) => {
                if (error)
                    reject(Status.FAILED);
                else
                    resolve(Status.SUCCESFUL);
            });
        });
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
        return new Promise((resolve, reject) => {
            let sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Expiry: azure.date.minutesFromNow(60)
                },
            };
            let token = AzureStorage.blobService.generateSharedAccessSignature(AzureStorage.containerImages, image, sharedAccessPolicy);
            let sasUrl = AzureStorage.blobService.getUrl(AzureStorage.containerImages, image, token);
            request(sasUrl, (err, res) => {
                if (err)
                    reject(Status.FAILED);
                if (res.statusCode === constants_1.StatusCode.OK)
                    resolve(sasUrl);
                reject(Status.FAILED);
            });
        });
    }
    AzureStorage.getURLforImage = getURLforImage;
})(AzureStorage = exports.AzureStorage || (exports.AzureStorage = {}));
//# sourceMappingURL=azure-service.js.map