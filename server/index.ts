
import * as express from 'express';
import * as multer from 'multer';
import * as fs from 'fs';
import { StatusCode, storagePath, base64png } from './constants';
import { AzureStorage } from './azure-service';
import * as converter from './dcmtk/dcmj2pnm';

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
    res.setTimeout(480000, () => {
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
*/
server.post('/_upload', extendTimeout, storage.array('data'), async (req, res) => {
    const files = req.files as Express.Multer.File[];
    // Upload all the files to the AzureStorage.
    const uploads = files.map(async (file) => {
        const uploadDicom = AzureStorage.upload(AzureStorage.containerDicoms, file.filename, file.path);
        const convert = new converter.Dcmj2pnm().convertToPng(file.path, 'sample.png', (p, s) => { return s; });
        await convert;
        const uploadImage = await AzureStorage.upload(AzureStorage.containerImages, 'sample.png', 'images/sample.png');
        await uploadDicom, uploadImage;
        fs.unlink(file.path, () => {});
        // fs.unlink('images/sample.png', () => {});
        return true;
    });
    await Promise.all(uploads);
    res.sendStatus(StatusCode.OK).end();
});

/*
    Route:      GET '/_images'
    Expects:    
    --------------------------------------------
    Returns all PNG images to the client.
*/
server.get('/_images', (req, res) => {
    fs.readFile("images/sample.png", (err, data) => {
        if (err) { res.sendStatus(StatusCode.InternalServerError).end(); }
        res.statusCode = StatusCode.OK;
        res.send(base64png + new Buffer(data).toString('base64')).end();
    });
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
server.get('_images/:id', (req, res) => {
    res.sendStatus(StatusCode.NotImplemented).end();
});

// Listen and serve.
const port = 8080;
server.listen(port, () => {
    console.log("Listening on port", port);
});
