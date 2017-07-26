
import { Router } from 'express';
import * as multer from 'multer';
import * as fs from 'fs';

import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage } from '../../azure-service';
import { Converter } from '../../converter';
import { JSONCreator } from "../../Objects";

export const rootUpload = '/upload';
export const routerUpload = Router();

let jsonCreator: JSONCreator = new JSONCreator();

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
            endpoint: '/api/upload',
            message: 'Uploads is an endpoint for uploading series of DICOM images.'
        }
    );
});

interface UploadMessage {
    name: string;
    id: string;
    err: string;
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
    // Keep track of all the files converted
    // and if any error happened, append it along the way.
    
    const files = req.files as Express.Multer.File[];
    // Upload all the files from the request to the AzureStorage.
    const uploads = files.map(async (file) => {
        try {
            var upload: UploadMessage = { name: file.originalname, id: null, err: null };
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
            // Assign the upload's id.
            upload.id = file.filename;
        } catch (e) {
            // Assign errors for each case of exception.
            if (e === Converter.Status.FAILED) {
                upload.err = 'Conversion Error';
            }
            else if (e === AzureStorage.Status.FAILED) {
                upload.err = 'Storage Error';
            }
        } finally {
            // Remove both formats from the local storage.
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + '.png', () => { });
        }
        return upload;
    });
    // Wait for all upload promises.
    await Promise.all(uploads).then((uploads: UploadMessage[]) => {
        res.json(
            {
                statuses: uploads.slice()
            }
        )
    });
});

/*
    Route:      GET '_upload:id'
    Expects:    
    --------------------------------------------
    Returns detalis about upload.
*/
routerUpload.get('/:id', (req, res) => {
    if (req.params.id == 12345) {
        let responseJSON = jsonCreator.getUploadJSON();
        res.json(responseJSON);
    } else {
        res.json({ status: "INVALID UPLOAD ID" });
    }

});
