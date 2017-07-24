
import { storagePath, imagePath } from './constants';

/*
*   Status of operation
*   SUCCESSFUL          = dicom file converted and image stored in path 
*   COMPILATION_FAILED  = error during compilation
*   FILE_NOT_FOUNT      = dicom file was to found in system
*/
export enum ConvertionStatus {
    SUCCESSFUL,
    COMPILATION_FAILED
}

export namespace Converter {
    const exePath = 'dcmj2pnm';
    const exec = require('child_process').exec;

    const convert = (dicomName: string, args: string[]): Promise<ConvertionStatus> => {
        return new Promise((resolve, reject) => {
            let dicomSrcPath = storagePath + dicomName;
            let imgSrcPath = imagePath + dicomName + '.png';
            let cmd = exePath + ' ' + dicomSrcPath + ' ' + imgSrcPath;

            args.forEach((arg) => {
                cmd = cmd + ' ' + arg;
            });
            exec(cmd, (error, stdout, stderr) => {
                if (error === null) { resolve(ConvertionStatus.SUCCESSFUL); }
                else { reject(ConvertionStatus.COMPILATION_FAILED); }
            });
        });
    }

    // Converts DICOM file to 16 bit PNG file using dcmj2pnm.exe and store it in the file system.
    export const toPng = (dicomName: string): Promise<ConvertionStatus> => {
        return convert(dicomName, ['--write-16-bit-png']);
    }
}
