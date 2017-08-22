import { Router } from 'express';
import { StatusCode } from '../../constants';
import { AzureStorage, AzureDatabase } from '../../azure-service';
import { json } from 'body-parser';
import { DeleteController } from "../../controllers/delete";

export const rootDelete = '/delete';
export const routerDelete = Router();

routerDelete.delete('/', async (req, res) => {
    console.log('delete route');
    try {
        let status = await DeleteController.removeAllData();
        res.sendStatus(StatusCode.Accepted);
    } catch (e) {
        res.json({ error: "DB_ERROR" });
    }
});