import { DownloadData } from '../routes/api/download';
import { ImageOperations } from "./imageResizing";
import * as PromiseBlueBird from 'bluebird';
import { AzureDatabase, AzureStorage } from "../azure-service";
import * as _ from 'lodash';
import { UploadJSON } from "../Objects";
import { DeleteData, DeleteSelectedData, ItemTypes } from "../routes/api/delete";

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

            // Delete each image and corresponding thumbnail from blob storage
            _.forEach(imagesToDelete, async(image) => {
                await AzureStorage.deleteImageAndThumbnail(image);
            })

            // Delete everything from MongoDB connections
            await AzureDatabase.removeAll();
            resolve(true);
        });
    }

    export const removeSelected = (data: DeleteSelectedData) => {
        return new Promise<boolean>(async (resolve, reject) => {
            console.log('got selected data', data);
            let images: string[] = [];
            switch (data.itemType) {
                case ItemTypes.PATIENT:
                    for (var id of data.IDs) {
                        // Get the list of patient's images first
                        images = images.concat(await getPatientsImages(id));
                        // Delete patient's document
                        let result = await AzureDatabase.removePatient(id);
                    }
                    break;
                case ItemTypes.STUDY:
                    for (var id of data.IDs) {
                        images = images.concat(await getStudyImages(data.patient, id));
                        let result = await AzureDatabase.removePatientsStudy(data.patient, id);
                    }
                    break;
                case ItemTypes.SERIES:
                    for (var id of data.IDs) {
                        images = images.concat(await getSeriesImages(data.patient, data.study, id));
                        let result = await AzureDatabase.removeStudySeries(data.patient, data.study, id);
                    }
                    break;
                case ItemTypes.IMAGE:
                    for (var id of data.IDs) {
                        images = data.IDs;
                        let result = await AzureDatabase.removeSeriesImage(data.patient, data.study, data.series, id);
                    }
                    break;
            }
            console.log('IMAGES', images);
            
            // Delete images from blob storage
            // TODO do this in batches, Kiko knows
            for (var image of images) {
                await AzureStorage.deleteImageAndThumbnail(image);
            }
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

    async function getPatientsImages(patientID: string): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            let images: string[] = [];
            let allPatients: UploadJSON[] = await AzureDatabase.getAllPatients();
            allPatients.forEach(patient => {
                if (patient.patientID === patientID) {
                    _.forEach(getPatientImages(patient), (image) => {
                        images.push(image);
                    });
                }
            });
            resolve(images);
        })
    }

    async function getStudyImages(patientID: string, studyID: string): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            let images: string[] = [];
            let allPatients: UploadJSON[] = await AzureDatabase.getAllPatients();
            allPatients.forEach(patient => {
                if (patient.patientID === patientID) {
                    _.forEach(patient.studies, (study) => {
                        if (study.studyID === studyID) {
                            _.forEach(study.series, (series) => {
                                _.forEach(series.images, (image) => {
                                    images.push(image.imageID);
                                })
                            })
                        }
                    });
                }
            });
            resolve(images);
        })
    }

    async function getSeriesImages(patientID: string, studyID: string, seriesID: string): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            let images: string[] = [];
            let allPatients: UploadJSON[] = await AzureDatabase.getAllPatients();
            allPatients.forEach(patient => {
                if (patient.patientID === patientID) {
                    _.forEach(patient.studies, (study) => {
                        if (study.studyID === studyID) {
                            _.forEach(study.series, (series) => {
                                if (series.seriesID === seriesID) {
                                    _.forEach(series.images, (image) => {
                                        images.push(image.imageID);
                                    })
                                }
                            })
                        }
                    });
                }
            });
            resolve(images);
        })
    }
}