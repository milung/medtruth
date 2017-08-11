
import * as express from 'express';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as archiver from 'archiver';

import { AzureStorage, AzureDatabase } from '../../azure-service';
import { StatusCode } from '../../constants';

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

/*
    Route:      GET '/download'
    --------------------------------------------
    // TODO: Think of a way how the download endpoint will work.
*/
routerDownload.get('/', (req, res) => {
    // Create a new archiver with options set to ZIP format.
    let archive = archiver('zip');

    // Writes the response's header.
    res.writeHead(StatusCode.OK, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=Test.zip',
    });

    // Pipe the ziping to the response.
    archive.pipe(res);

    // Dynamically append to the zip file.
    archive.append('Ahoj Feďo', { name: 'Pozdrav.txt' });

    // Finalize the stream.
    archive.finalize();
});
