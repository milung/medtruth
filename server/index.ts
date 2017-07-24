
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import { StatusCode, storagePath, imagePath } from './constants';
import { AzureStorage } from './azure-service';
import { Converter } from './converter';

// Set-up a server, that automatically serves static files.
const server = express();
server.use(express.static('public/'));

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

/*
    Route:       POST '/_upload'.
    Middleware:  extendTimeout, Multer array of data.
    Expects:     Form-data, containing files.
    -----------------------------------------------------------------------
    Saves incoming files to the 'uploadsPath' folder.
    Files HAVE TO contain a header: 'Content-Type': 'multipart/form-data'.
    Files are sent to the Azure Storage and converted to the PNG format.
*/;
server.post('/_upload', extendTimeout, storage.array('data'), (req, res) => {
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
            // Remove files from the local storage.
            fs.unlink(file.path, () => { });
            fs.unlink(imagePath + file.filename + '.png', () => {});
        } catch (e) {
            console.error("Something got wrong", e);
        }
        return true;
    });
    Promise.all(uploads).then(() => {
        console.log(files[0].filename);
        res.json(
            {
                images_id: [files.map((file) => { return file.filename; })]
            }
        ).end();
    })
});

/*
    Route:      GET '/_images'
    Expects:    
    --------------------------------------------
    Returns all PNG images to the client.
*/

server.get('/_images', (req, res) => {
    res.sendStatus(StatusCode.OK).end();
});

/*
    Route:      GET '/_images/latest'
    Expects:    JSON, containing number of latest images.
    --------------------------------------------
    Returns latest PNG images uploaded to the server.
*/
server.get('/_images/latest', (req, res) => {
    res.sendStatus(StatusCode.NotImplemented).end();
});

/*
    Route:      GET '/_images/:id'
    Expects:    JSON, containing an id of an image.
    --------------------------------------------
    Returns a PNG image by id.
*/
server.get('/_images/:id', async (req, res) => {
    let id = req.params.id + ".png";
    let url: string = await AzureStorage.getURLforImage(id);
    res.send(url).end();
});

// Listen and serve.
const port = 8080;
server.listen(port, () => {
    console.log("Listening on port", port);
});
