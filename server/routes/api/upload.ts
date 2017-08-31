
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as lo from 'lodash';

import { UploadController } from '../../controllers/upload';
import { StatusCode, storagePath, imagePath } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { Merger } from "../../merger/objectMerger";
import { TerminatedUpload } from "../../Objects";
import * as _ from "lodash";
export const rootUpload = '/upload';
export const routerUpload = express.Router();



// Middleware for extending the response's timeout for uploading larger files.
const extendTimeout = (req, res, next) => {
    res.setTimeout(360000, () => {
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
            message: 'Upload is an endpoint for uploading series of DICOM images.'
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
    
    // let jsonCreator=new JSONCreator();
    // let data=jsonCreator.getUploadJSON();
    // res.json(data);

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


routerUpload.get('/terminated/list', async (req, res) => {
    try{        
        let terminatedUploads = await AzureDatabase.getTerminatedUploads();   
        res.json(terminatedUploads);
    }catch(err){
        res.sendStatus(StatusCode.InternalServerError);
    }
});




routerUpload.get('/keep/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);
    try{
        let upload: TerminatedUpload = await AzureDatabase.getTerminatedUpload(id);
        let patients = upload.patients;
        console.log("patients ",patients);        
        await Merger.mergePatientsToDB(patients);
        console.log("merged");
        
        await AzureDatabase.removeTerminatedUpload(id);
        console.log("REMOVED");
        
        res.json(StatusCode.OK);
    }catch(err){
        console.log(err);
        
        res.sendStatus(StatusCode.BadRequest);
    }
  
});

routerUpload.get('/delete/:id', async (req, res) => {
    console.log("IN DELETE");
    let id = Number.parseInt(req.params.id);
    let upload: TerminatedUpload = await AzureDatabase.getTerminatedUpload(id);
    await AzureDatabase.removeTerminatedUpload(id);
    res.sendStatus(StatusCode.OK);
    console.log("SEND STATUS OK");
    
    let patients = upload.patients;
    let patientImages = [];

    _.forEach(patients, (patient)=>{
        _.forEach(patient.studies, (study) => {
            _.forEach(study.series, (serie => {
                _.forEach(serie.images, (image) => {
                    patientImages.push(image.imageID);
                });
            }));
        });
    });
    let removeAll = patientImages.map((image) => {
        return AzureStorage.deleteImageAndThumbnail(image);
    }, { concurrency: 5 });
    // w8 'till all patients are fetched
    await Promise.all(removeAll);
    console.log("ALL REMOVED");
});


