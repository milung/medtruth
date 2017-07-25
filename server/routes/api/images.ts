
import { Router } from 'express';
import { StatusCode } from '../../constants';
import { AzureStorage } from '../../azure-service';

export const rootImages     = '/_images';
export const routerImages   = Router();

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
    Route:      GET '/_images'
    Expects:    
    --------------------------------------------
    Returns all PNG images to the client.
*/
routerImages.get('/', (req, res) => {
    res.sendStatus(StatusCode.NotImplemented);
});

/*
    Route:      GET '/_images/latest'
    Expects:    JSON, containing number of latest images.
    --------------------------------------------
    Returns latest PNG images uploaded to the server.
*/
routerImages.get('/latest', (req, res) => {
    res.sendStatus(StatusCode.NotImplemented);
});

/*
    Route:      GET '/_images/:id'
    Expects:    JSON, containing an id of an image.
    --------------------------------------------
    Returns a PNG image by id.
*/
routerImages.get('/:id', async (req, res) => {
    let id = req.params.id + ".png";
    let url: string = await AzureStorage.getURLforImage(id);
    res.send(url).end();
});
