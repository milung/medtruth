
import * as express from 'express';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as archiver from 'archiver';

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
/*
    Route:      POST '/download'
    --------------------------------------------
    // TODO: Think of a way how the download endpoint will work.
*/
routerDownload.post('/', json(), async (req, res) => {
    let data: DownloadData = req.body;
    let archive = archiver('zip');
    let zippedFilename = "data.zip"
    
    var header = {
        "Content-Type": "application/x-zip",
        "Pragma": "public",
        "Expires": "0",
        "Cache-Control": "private, must-revalidate, post-check=0, pre-check=0",
        "Content-disposition": 'attachment; filename="' + zippedFilename + '"'
    };
    res.writeHead(StatusCode.OK, header);
    /*
        // Writes the response's header.
        res.writeHead(StatusCode.OK, {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename=Test.zip',
        });
        */

    // Pipe the ziping to the response.
    archive.pipe(res);

    await DownloadController.downloadImages(data, archive);

    // Finalize the stream.
    archive.finalize();
});


