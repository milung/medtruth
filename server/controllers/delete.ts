import { DownloadData } from '../routes/api/download';
import { ImageOperations } from "./imageResizing";
import * as PromiseBlueBird from 'bluebird';
import { AzureDatabase, AzureStorage } from "../azure-service";
import * as _ from 'lodash';
import { UploadJSON } from "../Objects";

export namespace DeleteController {
    export const removeAllData = () => {
        return new PromiseBlueBird<boolean>(async (resolve, reject) => {
            let allPatients: UploadJSON[] = await AzureDatabase.getAllPatients();
            //AzureDatabase.deleteAllPatients();
            let imagesToDelete: string[] = [];
            allPatients.forEach(patient => {
                let images: string[] = getPatientImages(patient);
                _.forEach(images, (image) => {
                    imagesToDelete.push(image);
                });
            });

            try {
                console.log(imagesToDelete);
                
                await removeFromAzureStorage(imagesToDelete);

                resolve(true);
            } catch (error) {
                console.log('DELETE REJECT');
                
                console.log(error);
                
                reject(false);
            }
            resolve(true);
        });
    }

    function getPatientImages(patient: UploadJSON): string[] {
        let patientImages = [];

        _.forEach(patient.studies, (study) => {
            _.forEach(study.series, (serie) => {
                _.forEach(serie.images, (image) => {
                    patientImages.push(image.imageID);
                });
            });
        });

        return patientImages;
    }


    function removeFromAzureStorage(images: string[]) {
        return new PromiseBlueBird(async (reject, resolve) => {
            // create promises concurrency max 10
            let removes = PromiseBlueBird.map(images, (imageId) => {
                console.log("imageID: "+imageId);
                
                return AzureStorage.deleteImageAndThumbnail(imageId).reflect();
            }, { concurrency: 10 });

            // await for all to be executed
            try {
                await PromiseBlueBird.all(removes);
                resolve();
            } catch (error) {
                console.log("removeFromAzureStorage");
                console.log(error);
                
                
                reject();
            }
        });
    }


}