
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as lo from 'lodash';

import { UploadController } from '../../controllers/upload';
import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { JSONCreator } from '../../Objects';
export const rootUpload = '/upload';
export const routerUpload = express.Router();

let jsonCreator: JSONCreator = new JSONCreator();

// Middleware for extending the response's timeout for uploading larger files.
const extendTimeout = (req, res, next) => {
    res.setTimeout(180000, () => {
        res.sendStatus(StatusCode.GatewayTimeout);
    });
    next();
}

// Middleware of storage to the local folder for incoming files.
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    }
});
const storage = multer({ storage: storageConfig });

/*
    Route:      OPTIONS '/upload'
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

/*
    Route:      POST '/upload'
    Middleware: extendTimeout, Multer storage, Root upload controller
    Expects:    Form-data
    --------------------------------------------
    Converts DICOM files to the PNG and uploads both formats to the Azure storage.
    Returns JSON, that cointains an array of names, id's 
    and if occured, errors of the converted files.
*/
routerUpload.post('/',
    extendTimeout,
    storage.any(),
    new UploadController().Root,
    async (req: express.Request, res: express.Response) => {
        res.json(
            {
                ...req.params.statuses
            }
        );
    }
);

/*
    Route:      GET 'upload/:id'
    Expects:    
    --------------------------------------------
    Returns details about upload's id.
*/
routerUpload.get('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);
    console.log("uploadid: "+id);
    
    if (id === undefined) {
        res.sendStatus(StatusCode.BadRequest);
        return;
    }

    if (id != -1) {
        let responseJSON = await AzureDatabase.getUploadDocument(id);
        if (responseJSON === undefined) {
            res.sendStatus(StatusCode.NotFound);
        } else {
            res.json(responseJSON);
        }
    } else {
        let responseJSON = await AzureDatabase.getLastUpload();
        if (responseJSON === undefined) {
            res.sendStatus(StatusCode.NotFound);
        } else {
            res.json(responseJSON);
        }
    }

});

