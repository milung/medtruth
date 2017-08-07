
import { Router } from "express";
import { AzureDatabase } from "../../azure-service";

export const rootLabels = '/labels';
export const routerLabels = Router();

routerLabels.get('/', async (req, res) => {
    let result: string[] = await AzureDatabase.getLabels();
    res.json(result);
});


interface Attribute {
    key: string;
    value: number;
}

routerLabels.post('/', async (req, res) => {
    let attributes: Attribute[] = [{key: 'mozog', value: 1}, {key: 'mozog', value: 1}, {key: 'mozog', value: 1}];
    let result: any = await AzureDatabase.putToLabels(...attributes);
    res.json(result);
});