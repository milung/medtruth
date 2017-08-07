
import { storagePath, imagePath } from './constants';

export namespace Converter {
    let dicomPath = 'uploads/';
    let imagePath = 'images/';

    const exePath = 'dcmj2pnm';
    //const exec = require('child_process').exec;
    const execFile = require('child_process').execFile;

    export enum Status {
        SUCCESSFUL,
        FAILED
    }

    const convert = (dicomName: string, args: string[]): Promise<Status> => {
        return new Promise((resolve, reject) => {
            let dicomSrcPath = dicomPath + dicomName;
            let imgSrcPath = imagePath + dicomName + '.png';
            args.unshift(imgSrcPath);
            args.unshift(dicomSrcPath);
            execFile(exePath, args, { cwd: 'out/' }, (error, stdout, stderr) => {
                if (error === null) {
                    console.log("[Converting] " + dicomName + " OK ✔️");
                    resolve(Status.SUCCESSFUL);
                }
                else {
                    console.log("[Converting] " + dicomName + " FAIL ❌");
                    console.log(error);
                    console.log("stdout");
                    console.log(stdout);
                    console.log("stderr");
                    console.log(stderr);



                    reject(Status.FAILED);
                }
            });

        });
    }

    // Converts DICOM file to 16 bit PNG file using dcmj2pnm.exe and store it in the file system.
    export const toPng = (dicomName: string): Promise<Status> => {
        return convert(dicomName, [
            '--write-16-bit-png',
            '--min-max-window',
            '--no-overlays',
            '--interpolate',
            '3',

        ]);
    }
}
