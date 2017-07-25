
import { Router } from 'express';
import { rootUpload, routerUpload } from './upload';
import { rootImages, routerImages } from './images';

export const api = Router();
api.use('/_upload', routerUpload);
api.use('/_images', routerImages);

/*
    Route:      OPTIONS '/api'
    Expects:    
    --------------------------------------------
    Returns information about this endpoint.
*/
api.options('/', (req, res) => {
    return res.json(
        {
            routes: [
                { route: rootUpload },
                { route: rootImages }
            ]
        }
    );
});
