import { Router } from 'express';
import { StatusCode } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { json } from 'body-parser';
import * as sharp from 'sharp';
import { DownloadController } from "../../controllers/download";
import { DeleteController } from "../../controllers/delete";

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
        console.log("Patiens:", data);
        res.json(data);
    } catch (e) {
        res.json({ error: "DB_ERROR" });
    }
});

routerPatients.delete('/', async (req, res) => {
    try {
        let status = await DeleteController.removeAllData();
        res.sendStatus(StatusCode.Accepted);
    } catch (e) {
        res.json({ error: "DB_ERROR" });
    }
});

