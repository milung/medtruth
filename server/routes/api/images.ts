
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
    Expects:    
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
routerImages.get('/latest', (req, res) => {
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

routerImages.get('/:id/assign', async (req, res) => {
    let id = req.params.id;
    let result = await AzureDatabase.getAttributes(id);
    res.json(result);
});

// routerImages.delete('/:id/assign', json(), async (req, res) => {
//     let id = req.params.id;
//     let attributes: Attribute[] = req.body.attributes;
//     let result = await AzureDatabase.removeFromAttributes(id, ...attributes);
//     res.json(result);
// });

