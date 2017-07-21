"use strict";
exports.__esModule = true;
var express = require("express");
var multer = require("multer");
var constants_1 = require("./constants");
var azure_service_1 = require("./azure-service");
var fs = require("fs");
// Set-up a server, that automatically serves static files.
var server = express();
server.use(express.static('public'));
// Set-up a storage to the local folder for incoming files.
var storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, constants_1.storagePath);
    },
    filename: function (req, file, cb) {
        cb(null, "sample.dcm");
    }
});
var storage = multer({ storage: storageConfig });
/*
    Route:       POST '/_upload'.
    Middleware:  Multer.
    Expects:     Form-data containing a single file.
    -----------------------------------------------------------------------
    Saves incoming files to the 'uploadsPath' folder.
    Files HAVE TO contain a header: 'Content-Type': 'multipart/form-data'.
    Files are sent to the Azure Storage.
    Then they are converted to the PNG format and sent back to the response.
*/
server.post('/_upload', storage.single('data'), function (req, res) {
    // TODO: Create a way to recognize images downloaded and remove them
    // from the disk.
    azure_service_1.AzureStorage.upload('blob', 'sample.dcm')
        .then(function (message) {
        // TODO: Convert a sent DICOM file to the PNG.
        console.log(message);
        res.sendStatus(constants_1.StatusCode.OK);
    })["catch"](function (message) {
        console.log(message);
        res.sendStatus(constants_1.StatusCode.BadRequest);
    });
});
/*
    Route:      GET '/_image'
    Expects:
    --------------------------------------------
    Returns image to the client.
*/
server.get('/_image', function (req, res) {
    var file = fs.readFileSync("uploads/sample.png");
    res.send("data:image/png;base64," + new Buffer(file).toString('base64'));
});
// Listen and serve.
var port = process.env.PORT || 8080;
server.listen(port, function () {
    console.log("Listening on port", port);
});
