
import * as express from 'express';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as archiver from 'archiver';
import * as uuid from 'uuid/v1';

import { AzureStorage, AzureDatabase } from '../../azure-service';
import { StatusCode } from '../../constants';
import { json } from 'body-parser';
import { DownloadController } from '../../controllers/download';

export const rootDownload = '/download';
export const routerDownload = express.Router();

/*
    Route:      OPTIONS '/download'
    Expects:    
    --------------------------------------------
    Returns information about this endpoint.
*/
routerDownload.options('/', (req, res) => {
    return res.json(
        {
            endpoint: '/api/download',
            message: 'Download is an endpoint for downloading exported images with specified labels.'
        }
    );
});

export interface DownloadData {
    labels: LabelStatus[],
    format: OutputType
}

export interface LabelStatus {
    labelName: string;
    selected: boolean;
}

export enum OutputType {
    STATE_OF_LABEL, REGRESSION_VALUE
}


const dataForDownload  = {}

/*
    Route:      POST '/download'
    --------------------------------------------
    // TODO: Think of a way how the download endpoint will work.
*/
routerDownload.post('/', json(), async (req, res) => {
    let data: DownloadData = req.body;
    
    let id = uuid();
    dataForDownload[id] = data;
    setTimeout(() => {
        console.log(dataForDownload);
        
        delete dataForDownload[id];
        console.log('po');
        
        console.log(dataForDownload);
        
    }, 5000);
    res.json({id: id});
    /*
    let archive = archiver('zip');
    let zippedFilename = "data.zip"
    console.log("POST");
    
    var header = {
        "Content-Type": "application/x-zip",
        "Pragma": "public",
        "Expires": "0",
        "Cache-Control": "private, must-revalidate, post-check=0, pre-check=0",
        "Content-disposition": 'attachment; filename="' + zippedFilename + '"'
    };
    res.writeHead(StatusCode.OK, header);
 
        // Writes the response's header.
        res.writeHead(StatusCode.OK, {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=Test.zip',
        });
   

    // Pipe the ziping to the response.
    archive.pipe(res);
    
    await DownloadController.downloadImages(data, archive);

    // Finalize the stream.
    archive.finalize();
    */
});
    /*
    Route:      POST '/download'
    --------------------------------------------
    // TODO: Think of a way how the download endpoint will work.
*/
routerDownload.get('/:id', async (req, res) => {
    let data = dataForDownload[req.params.id];
    if(data === null || data === undefined) res.sendStatus(StatusCode.BadRequest);

    let archive = archiver('zip');
    let zippedFilename = "data.zip"
    console.log("GET");
    
    var header = {
        "Content-Type": "application/x-zip",
        "Pragma": "public",
        "Expires": "0",
        "Cache-Control": "private, must-revalidate, post-check=0, pre-check=0",
        "Content-disposition": 'attachment; filename="' + zippedFilename + '"'
    };
    res.writeHead(StatusCode.OK, header);

    // Pipe the ziping to the response.
    archive.pipe(res);
    
    await DownloadController.downloadImages(data, archive);

    // Finalize the stream.
    archive.finalize();
    
});
    