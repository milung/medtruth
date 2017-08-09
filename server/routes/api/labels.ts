
import { Router } from "express";
import { AzureDatabase } from "../../azure-service";
import { json } from "body-parser";

export const rootLabels = '/labels';
export const routerLabels = Router();

routerLabels.get('/', async (req, res) => {
    let result: string[] = await AzureDatabase.getLabels();
    res.json(result);
});

// routerLabels.post('/', json(), async (req, res) => {
//     let labels: string[] = req.body.labels;
//     let result: any = await AzureDatabase.putToLabels(labels);
//     res.json(result);
// });

// routerLabels.delete('/', json(), async (req, res) => {
//     let labels: string[] = req.body.labels;
//     let result: any = await AzureDatabase.removeFromLabels(...labels);
//     res.json(result);
// });