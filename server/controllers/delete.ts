import { DownloadData } from '../routes/api/download';
import { ImageOperations } from "./imageResizing";
import * as PromiseBlueBird from 'bluebird';
import { AzureDatabase } from "../azure-service";
import * as _ from 'lodash';
import { UploadJSON } from "../Objects";

export namespace DeleteController {
    export const removeAllData = () => {
        return new PromiseBlueBird<boolean>(async (resolve, reject) => {
            let allPatients: UploadJSON[] = await AzureDatabase.getAllPatients();
            // AzureDatabase.deleteAllPatients();
            let imagesToDelete: string[] = [];
            allPatients.forEach(patient => {
                let images: string[] = getPatientImages(patient);
                _.forEach(images, (image) => {
                    imagesToDelete.push(image);
                });
            });
            console.log('imagesToDelete', imagesToDelete);

            await AzureDatabase.removeAll();
            resolve(true);
        });
    }

    function getPatientImages(patient: UploadJSON): string[] {
        let patientImages = [];
        console.log(patient.studies);
        _.forEach(patient.studies, (study) => {
            _.forEach(study.series, (serie => {
                _.forEach(serie.images, (image) => {
                    patientImages.push(image);
                });
            }));
        });
        console.log("merged");
        return patientImages;
    }
}