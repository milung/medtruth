
import { Router } from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage } from '../../azure-service';
import { Converter } from '../../converter';

export const rootUpload = '/_upload';
export const routerUpload = Router();

// Set-up a storage to the local folder for incoming files.
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    }
});
const storage = multer({ storage: storageConfig });

// Extend the response's timeout for uploading larger files.
const extendTimeout = (req, res, next) => {
    res.setTimeout(60000, () => {
        res.sendStatus(StatusCode.GatewayTimeout);
    });
    next();
}

/*
    Route:      OPTIONS '/_uploads'
    Expects:    
    --------------------------------------------
    Returns information about this endpoint.
*/
routerUpload.options('/', (req, res) => {
    return res.json(
        {
            endpoint: '/api/_upload',
            message: 'Uploads is an endpoint for uploading series of DICOM images.'
        }
    );
});

interface UploadError {
    filename: string,
    message: string
}

/*
    Route:      POST '/_upload'
    Middleware: extendTimeout, Multer storage
    Expects:    Form-data
    --------------------------------------------
    Converts DICOM files to the PNG and uploads both formats to the Azure storage.
    Returns JSON, that cointains ID's of the converted files.
*/
routerUpload.post('/', extendTimeout, storage.array('data'), async (req, res) => {
    // Upload all the files from the request to the AzureStorage.
    const files = req.files as Express.Multer.File[];
    let err: UploadError[];
    const uploads = files.map(async (file) => {
        try {
            // Convert and upload DICOM to Azure asynchronously.
            let conversion = Converter.toPng(file.filename);
            let uploadingDicom = AzureStorage.toDicoms(
                file.filename,
                file.path);
            // Before proceeding to upload PNG to Azure, make sure to convert first.
            await conversion;
            let uploadingImage = AzureStorage.toImages(
                file.filename + '.png',
                imagePath + file.filename + '.png');
            // Await for uploads, if necessary.
            await uploadingDicom, uploadingImage;
        } catch (e) {
            let filename = file.originalname;
            if (e === Converter.Status.FAILED) {
                err.push({ filename: filename, message: "Conversion Error" });
            }
            if (e === AzureStorage.Status.FAILED) {
                err.push({ filename: filename, message: "Storage Error" });
            }
        } finally {
            // Remove both formats from the local storage.
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + '.png', () => { });
        }
        return true;
    });
    // Wait for all upload promises.
    await Promise.all(uploads);
    // Send a JSON response.
    res.json(
        {
            images_id: [files.map((file) => { return file.filename; })],
            err: [...err]
        }
    ).end();
});
