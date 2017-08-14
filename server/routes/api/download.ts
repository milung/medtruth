
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


/*
    Route:      GET '/download'
    -------------------------------------------- 
*/
routerDownload.get('/img_map', async(req, res) => {
    // Create a new archiver with options set to ZIP format.
    let archive = archiver('zip');

    // Writes the response's header.
    res.writeHead(StatusCode.OK, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=Test.zip',
    });

    // Pipe the ziping to the response.
    archive.pipe(res);

     let url: string;
     let test=['test'];
     for(let j=0;j<=200;j++){
         test.push("test"+j);
     }

   // let id = "008e6ec3b2cf495e6a3a94b060e03786" + ".png";   
   // url = await AzureStorage.getURLforImage(id);
 
  
    let temp=test[0]+'\r\n';
    // Dynamically append to the zip file.

    for (let i=1;i<test.length;i++){      
       temp=temp.concat(test[i]+'\t'+0+'\r\n');      
    }
   
    archive.append(temp+'', { name: 'img_map.txt' });
  

    // Finalize the stream.
    archive.finalize();
});


