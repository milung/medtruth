
import { Router } from 'express';
import { StatusCode } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { json } from 'body-parser';

export const rootImages = '/images';
export const routerImages = Router();

/*
    Route:      OPTIONS '/_images'
    Expects:    
    --------------------------------------------
    Returns information about this endpoint.
*/
routerImages.options('/', (req, res) => {
    return res.json(
        {
            endpoint: '/api/_images',
            message: 'Images is an endpoint for retreiving converted images.'
        }
    );
});

/*
    Route:      GET '/images'
    --------------------------------------------
    Returns all PNG images to the client.
*/
routerImages.get('/', (req, res) => {
    res.sendStatus(StatusCode.NotImplemented);
});

/*
    Route:      GET '/images/latest'
    Expects:    JSON, containing number of latest images.
    --------------------------------------------
    Returns latest PNG images uploaded to the server.
*/
routerImages.get('/latest', json(), (req, res) => {
    res.sendStatus(StatusCode.NotImplemented);
});

/*
    Route:      GET '/images/:id'
    Expects:    Parameter 'id'
    --------------------------------------------
    Returns a JSON object containing 'url' from the Azure Storage.
*/
routerImages.get('/:id', async (req, res) => {
    let id = req.params.id + ".png";
   
    // Declare a status code and a retreived url.
    let code: number;
    let url: string;
    // Await for Azure Storage's url for image.
    try {
        url = await AzureStorage.getURLforImage(id);
        code = StatusCode.OK;
    } catch (e) {
        url = null;
        code = StatusCode.NotFound;
    }
    res.status(code).json(
        {
            url: url
        }
    );
});

/*
    Route:      PUT '/images/:id/assign'
    Expects:    JSON, containing key-value pairs.
    --------------------------------------------
    Updates, or creates new attributes for an image.
*/
interface Attribute {
    key: string;
    value: number;
}

routerImages.put('/:id/assign', json(), async (req, res) => {
    let id = req.params.id;
    let attributes: Attribute[] = req.body.attributes;
    let result = await AzureDatabase.putToAttributes(id, ...attributes);
    res.json(result);
});

/*
    Route:      GET '/images/:id/assign'
    --------------------------------------------
    Gets attributes from a single image id.
*/
routerImages.get('/:id/assign', async (req, res) => {
    let id = req.params.id;
    let result = await AzureDatabase.getAttributes(id);
    res.json(result);
});

/*
    Route:      GET '/series'
    Expects:    JSON, containing an upload, series & study ID.
    --------------------------------------------
    Returns a JSON array of image ID's and orders from an upload, study & series ID.
*/
interface SeriesRequest {
    uploadID:   number;
    studyID:    string;
    seriesID:   string;
}

routerImages.post('/series', json(), async (req, res) => {
    let seriesReq: SeriesRequest = { ...req.body };
    try {
        let result = await AzureDatabase.getImagesBySeriesId(seriesReq);
        res.json(result);
    } catch (e) {
        res.json({});
    }
});

routerImages.delete('/:id/assign', json(), async (req, res) => {
    let id = req.params.id;
    let labels: string[] = req.body.labels;
    try {
        await AzureDatabase.removeFromAttributes(id, labels);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(500);
    }
    
});

