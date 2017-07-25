
import { Router } from 'express';
import { StatusCode } from '../../constants';
import { AzureStorage } from '../../azure-service';

export const rootImages     = '/_images';
const imagesLatest          = '/latest';
const imagesId              = '/:id';
export const routerImages   = Router();

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
routerImages.get(imagesLatest, (req, res) => {
    res.sendStatus(StatusCode.NotImplemented).end();
});

/*
    Route:      GET '/_images/:id'
    Expects:    JSON, containing an id of an image.
    --------------------------------------------
    Returns a PNG image by id.
*/
routerImages.get(imagesId, async (req, res) => {
    let id = req.params.id + ".png";
    let url: string = await AzureStorage.getURLforImage(id);
    res.send(url).end();
});
