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

export interface DeleteData {
    patient: string;
    study: string;
    series: string;
    image: string;
}

export enum ItemTypes {
    IMAGE,
    SERIES,
    STUDY,
    PATIENT
}

export interface DeleteSelectedData {
    itemType: ItemTypes,
    patient: string,
    study: string,
    series: string,
    IDs: string[]           // array of IDs of items to be deleted 
}

routerDelete.post('/', json(), async (req, res) => {
    let data: DeleteSelectedData = req.body;
    console.log(data);

    try {
        let status = await DeleteController.removeSelected(data);
        res.sendStatus(StatusCode.Accepted);
    } catch (e) {
        res.json({ error: "DB_ERROR" });
    }
});