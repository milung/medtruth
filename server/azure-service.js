"use strict";
exports.__esModule = true;
var azure = require("azure-storage");
var es6_promise_1 = require("es6-promise");
var constants_1 = require("./constants");
var AzureStorage;
(function (AzureStorage) {
    var accountName = 'medtruth';
    var accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    var container = 'dicoms';
    function upload(blobName, fileName) {
        var blobService = azure.createBlobService(accountName, accountKey);
        var filePath = constants_1.storagePath + fileName;
        var message = "";
        return new es6_promise_1.Promise(function (resolve, reject) {
            blobService.createBlockBlobFromLocalFile(container, blobName, filePath, function (error, result, response) {
                if (!error) {
                    message = 'File ' + filePath + ' uploaded as ' + blobName;
                    resolve(message);
                }
                else {
                    message = error.message;
                    reject(message);
                }
            });
        });
    }
    AzureStorage.upload = upload;
})(AzureStorage = exports.AzureStorage || (exports.AzureStorage = {}));
