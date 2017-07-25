"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
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
})(ConvertionStatus = exports.ConvertionStatus || (exports.ConvertionStatus = {}));
var Converter;
(function (Converter) {
    const exePath = 'dcmj2pnm';
    const exec = require('child_process').exec;
    const convert = (dicomName, args) => {
        return new Promise((resolve, reject) => {
            let dicomSrcPath = constants_1.storagePath + dicomName;
            let imgSrcPath = constants_1.imagePath + dicomName + '.png';
            let cmd = exePath + ' ' + dicomSrcPath + ' ' + imgSrcPath;
            args.forEach((arg) => {
                cmd = cmd + ' ' + arg;
            });
            exec(cmd, (error, stdout, stderr) => {
                if (error === null) {
                    resolve(ConvertionStatus.SUCCESSFUL);
                }
                else {
                    reject(ConvertionStatus.COMPILATION_FAILED);
                }
            });
        });
    };
    // Converts DICOM file to 16 bit PNG file using dcmj2pnm.exe and store it in the file system.
    Converter.toPng = (dicomName) => {
        return convert(dicomName, [
            '--write-16-bit-png',
            '--min-max-window',
            '--no-overlays',
            '--interpolate 3'
        ]);
    };
})(Converter = exports.Converter || (exports.Converter = {}));
//# sourceMappingURL=converter.js.map