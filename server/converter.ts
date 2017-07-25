
import { storagePath, imagePath } from './constants';

export namespace Converter {
    const exePath   = 'dcmj2pnm';
    const exec      = require('child_process').exec;

    export enum Status {
        SUCCESSFUL,
        FAILED
    }

    const convert = (dicomName: string, args: string[]): Promise<Status> => {
        return new Promise((resolve, reject) => {
            let dicomSrcPath    = storagePath + dicomName;
            let imgSrcPath      = imagePath + dicomName + '.png';
            let cmd             = exePath + ' ' + dicomSrcPath + ' ' + imgSrcPath;

            args.forEach((arg) => {
                cmd = cmd + ' ' + arg;
            });
            exec(cmd, (error, stdout, stderr) => {
                if (error === null) resolve(Status.SUCCESSFUL);
                else                reject(Status.FAILED);
            });
        });
    }

    // Converts DICOM file to 16 bit PNG file using dcmj2pnm.exe and store it in the file system.
    export const toPng = (dicomName: string): Promise<Status> => {
        return convert(dicomName, [
            '--write-16-bit-png',
            '--min-max-window',
            '--no-overlays',
            '--interpolate 3'
        ]);
    }
}
