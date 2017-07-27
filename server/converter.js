"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
var Converter;
(function (Converter) {
    var exePath = 'dcmj2pnm';
    var exec = require('child_process').exec;
    var Status;
    (function (Status) {
        Status[Status["SUCCESSFUL"] = 0] = "SUCCESSFUL";
        Status[Status["FAILED"] = 1] = "FAILED";
    })(Status = Converter.Status || (Converter.Status = {}));
    var convert = function (dicomName, args) {
        return new Promise(function (resolve, reject) {
            var dicomSrcPath = constants_1.storagePath + dicomName;
            var imgSrcPath = constants_1.imagePath + dicomName + '.png';
            var cmd = exePath + ' ' + dicomSrcPath + ' ' + imgSrcPath;
            args.forEach(function (arg) {
                cmd = cmd + ' ' + arg;
            });
            exec(cmd, function (error, stdout, stderr) {
                if (error === null)
                    resolve(Status.SUCCESSFUL);
                else
                    reject(Status.FAILED);
            });
        });
    };
    // Converts DICOM file to 16 bit PNG file using dcmj2pnm.exe and store it in the file system.
    Converter.toPng = function (dicomName) {
        return convert(dicomName, [
            '--write-16-bit-png',
            '--min-max-window',
            '--no-overlays',
            '--interpolate 3'
        ]);
    };
})(Converter = exports.Converter || (exports.Converter = {}));
