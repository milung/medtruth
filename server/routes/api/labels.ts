
import { Router } from "express";
import { AzureDatabase } from "../../azure-service";
import { json } from "body-parser";

export const rootLabels = '/labels';
export const routerLabels = Router();

routerLabels.get('/', async (req, res) => {
    let result: string[] = await AzureDatabase.getLabels();
    res.json(result);
});