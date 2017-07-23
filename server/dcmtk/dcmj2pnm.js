"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require('path');
/*
*   Status of operation
*   SUCCESSFUL          = dicom file converted and image stored in path
*   COMPILATION_FAILED  = error during compilation
*   FILE_NOT_FOUNT      = dicom file was to found in system
*/
var ConvertionStatus;
(function (ConvertionStatus) {
    ConvertionStatus[ConvertionStatus["SUCCESSFUL"] = 0] = "SUCCESSFUL";
    ConvertionStatus[ConvertionStatus["COMPILATION_FAILED"] = 1] = "COMPILATION_FAILED";
    ConvertionStatus[ConvertionStatus["FILE_NOT_FOUND"] = 2] = "FILE_NOT_FOUND";
})(ConvertionStatus = exports.ConvertionStatus || (exports.ConvertionStatus = {}));
var Dcmj2pnm = (function () {
    function Dcmj2pnm() {
    }
    /*
    *   converts dicom file to image file using dcmj2pnm.exe based on arrguments
    *   callback function is called after
    *
    */
    Dcmj2pnm.prototype.convert = function (dicomPath, imageName, args, callback) {
        var exec = require('child_process').exec;
        var dcmPath = path.normalize(dicomPath);
        if (fs.existsSync(path.normalize(dcmPath))) {
            // Do something
            var exe = path.normalize('./dcmtk/dcmj2pnm.exe');
            var imgSrcPath = path.normalize('images/' + imageName);
            var args = args;
            var cmd_1 = exe + ' ' + dcmPath + ' ' + imgSrcPath;
            args.forEach(function (arg) {
                cmd_1 = cmd_1 + ' ' + arg;
            });
            exec(cmd_1, function (error, stdout, stderr) {
                if (error === null) {
                    callback(imgSrcPath, ConvertionStatus.SUCCESSFUL);
                }
                else {
                    callback('', ConvertionStatus.COMPILATION_FAILED);
                }
            });
        }
        else {
            callback('', ConvertionStatus.FILE_NOT_FOUND);
        }
    };
    /*
    *   converts dicom file to 16 bit png file using dcmj2pnm.exe and stored it in file system
    */
    Dcmj2pnm.prototype.convertToPng = function (dicomPath, imageName, callback) {
        this.convert(dicomPath, imageName, ['--write-16-bit-png'], callback);
    };
    return Dcmj2pnm;
}());
exports.Dcmj2pnm = Dcmj2pnm;
