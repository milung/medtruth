
import { Router } from 'express';
import { rootUpload, routerUpload } from './upload';
import { rootImages, routerImages } from './images';
import { rootDownload, routerDownload } from './download';

export const api = Router();
api.use('/upload', routerUpload);
api.use('/images', routerImages);
api.use('/download', routerDownload);

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
                { endpoint: rootUpload },
                { endpoint: rootImages },
                { endpoint: rootDownload },
            ]
        }
    );
});
