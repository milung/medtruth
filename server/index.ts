
import * as express from 'express';
import * as multer from 'multer';
import { StatusCode, storagePath, base64png } from './constants';
import { AzureStorage } from './azure-service';
import * as fs from 'fs';

// Set-up a server, that automatically serves static files.
const server = express();
server.use(express.static('/out/public'));

// Set-up a storage to the local folder for incoming files.
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    },
    filename: (req, file, cb) => {
        cb(null, "sample.dcm");
    }
});
const storage = multer({ storage: storageConfig });

/*
    Route:       POST '/_upload'.
    Middleware:  Multer.
    Expects:     Form-data containing a single file.
    -----------------------------------------------------------------------
    Saves incoming files to the 'uploadsPath' folder.
    Files HAVE TO contain a header: 'Content-Type': 'multipart/form-data'.
    Files are sent to the Azure Storage.
    Then they are converted to the PNG format and sent back to the response.
*/
server.post('/_upload', storage.single('data'), (req, res) => {
    // TODO: Create a way to recognize images downloaded and remove them
    // from the disk.
    AzureStorage.upload('blob', 'sample.dcm')
        // Upload to AzureStorage was succesful.
        .then((message: string) => {
            // TODO: Convert a sent DICOM file to the PNG.
            console.log(message);
            res.sendStatus(StatusCode.OK);
        })
        // Upload to AzureStorage triggered an error.
        .catch((message: string) => {
            console.log(message);
            res.sendStatus(StatusCode.BadRequest);
        });
});

/*
    Route:      GET '/_image'
    Expects:    
    --------------------------------------------
    Returns image to the client.
*/
server.get('/_image', (req, res) => {
    let file = fs.readFileSync("uploads/sample.png");
    res.send(base64png + new Buffer(file).toString('base64'));
});

// Listen and serve.
const port = process.env.PORT || 80;
server.listen(port, () => {
    console.log("Listening on port", port);
});
