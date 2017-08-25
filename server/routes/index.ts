import { Router } from 'express';
import { api } from './api';

export const routes = Router();
routes.use('/api', api);
