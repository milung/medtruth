
import { Router } from 'express';
import { StatusCode } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { json } from 'body-parser';

export const rootPatients = '/patients';
export const routerPatients = Router();

/*
    Route:      GET '/images'
    --------------------------------------------
    Returns all PNG images to the client.
*/
routerPatients.get('/', async (req, res) => {
    try {
        let data = await AzureDatabase.getAllPatients();
        console.log(data);
        res.json(data);
    } catch (e) {
        res.json({error: "DB_ERROR"});
    }


});

