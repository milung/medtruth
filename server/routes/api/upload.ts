
import { Router } from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage } from '../../azure-service';
import { Converter } from '../../converter';

export const rootUpload     = '/_upload';
export const routerUpload   = Router();

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
        res.sendStatus(StatusCode.GatewayTimeout).end();
    });
    next();
}

routerUpload.post('/', extendTimeout, storage.array('data'), async (req, res) => {
    const files = req.files as Express.Multer.File[];
    // Upload all the files to the AzureStorage.
    const uploads = files.map(async (file) => {
        try {
            // Convert and upload DICOM to Azure asynchronously.
            let convert = Converter.toPng(file.filename);
            let uploadDicom = AzureStorage.toDicoms(file.filename, file.path);
            // Before proceeding to upload PNG to Azure, make sure to convert first.
            await convert;
            let uploadPng = AzureStorage.toImages(file.filename + '.png', imagePath + file.filename + '.png');
            // Await for uploading, if necessary.
            await uploadDicom, uploadPng;
        } catch (e) {
            console.error("Something got wrong", e);
        } finally {
            // Remove files from the local storage.
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + '.png', () => { });
        }
        return true;
    });
    // For all successed promises, send a JSON response.
    await Promise.all(uploads);
    res.json(
        {
            images_id: [files.map((file) => { return file.filename; })]
        }
    ).end();
});
