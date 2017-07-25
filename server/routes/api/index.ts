
import { Router } from 'express';
import { routerUpload } from './upload';
import { routerImages } from './images';

export const api = Router();
api.use('/_upload', routerUpload);
api.use('/_images', routerImages);
