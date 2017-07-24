
import * as fs from 'fs';
const path = require('path');

/*
*   Status of operation
*   SUCCESSFUL          = dicom file converted and image stored in path 
*   COMPILATION_FAILED  = error during compilation
*   FILE_NOT_FOUNT      = dicom file was to found in system
*/
export enum ConvertionStatus {
    SUCCESSFUL,
    COMPILATION_FAILED,
    FILE_NOT_FOUND
}


export class Dcmj2pnm {

    /*
    *   converts dicom file to image file using dcmj2pnm.exe based on arrguments
    *   callback function is called after 
    *
    */
    public convert(dicomPath: string, imageName: string, args: string[], callback: (imagePath: string, status: ConvertionStatus) => void) {
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
    }

    /*
    *   converts dicom file to 16 bit png file using dcmj2pnm.exe and stored it in file system
    */
    public convertToPng(dicomPath: string, imageName: string, callback: (imagePath: string, status: ConvertionStatus) => void) {
        this.convert(dicomPath, imageName, ['--write-16-bit-png'], callback);
    }
}
