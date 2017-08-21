import { DownloadData } from '../routes/api/download';
import { ImageOperations } from "./imageResizing";
import * as PromiseBlueBird from 'bluebird';
import { AzureDatabase } from "../azure-service";

export namespace DownloadController {
    export const downloadImages = (data: DownloadData, archive: any) => {
        return new PromiseBlueBird(async (resolve, reject) => {
            let images = await getImagesForLabels(data, archive);
            console.log("IMAGES");

            console.log(images);


            console.time('duration: ');
            let status = await ImageOperations.convertImages(images, archive);
            let convertedImages: string[] = [];

            let i = 1;
            status.forEach(stat => {
                console.log(i + ". " + stat.imageID + " " + stat.converted);
                i++;
                if (stat.converted) convertedImages.push(stat.imageID);
            });

            let labelsPromise = writeLabels(data, archive, convertedImages);
            let createImages = createImagesPathFile(data, archive, convertedImages);
            let labelNames = writeLabelNames(data,archive);
            await PromiseBlueBird.all([labelsPromise, createImages,labelNames]);

            console.timeEnd('duration: ');
            resolve();
        });
    };

    const createImagesPathFile = (data: DownloadData, archive: any, images: string[]) => {
        return new PromiseBlueBird(async (resolve, reject) => {
            let imagesString = '';
            let pathToImage = '/data/';
            let ext = '.png';
            images.forEach(image => {
                imagesString += pathToImage + image + ext + ' 0\r\n';
            });

            archive.append(imagesString, { name: 'imgs_map_file.txt' });
            resolve();
        });
    };

    const getImagesForLabels = (data: DownloadData, archive: any) => {
        return new PromiseBlueBird<string[]>(async (resolve, reject) => {
            let imagesToWrite: string[] = [];
            let wasPush: boolean = false;
            let allImages: string[] = await AzureDatabase.getImagesWithLabels();
            console.log("Images: ", allImages);
            for (let image of allImages) {
                wasPush = false;
                let resData = await AzureDatabase.getAttributes(image);
                for (let label of data.labels) {
                    for (let attribute of resData.attributes) {
                        if (attribute.key === label.labelName && attribute.value !== 0 && !wasPush && label.selected) {
                            imagesToWrite.push(image);
                            wasPush = true;
                        }
                    }
                }
            }
            resolve(imagesToWrite);
        });
    };

    export async function writeLabels(data: DownloadData, archive: any, images: string[]) {
        return new PromiseBlueBird(async (resolve, reject) => {
            let stringOfValues: string = "";
            let imagesToWrite = images;

            for (let image of imagesToWrite) {
                let resData = await AzureDatabase.getAttributes(image);
                console.log("image: ", image);
                console.log("imageID: ", resData.imageID);
                console.log("attribute: ", resData.attributes);
                stringOfValues += "|labels ";
                if (data) {
                    for (let label of data.labels) {
                        console.log("label: ", label);
                        let writed = false;
                        if (resData.attributes) {
                            for (let attribute of resData.attributes) {
                                if (label.labelName === attribute.key && label.selected) {
                                    if (data.format === 1) {
                                        if (attribute.value === 1 || attribute.value === 0) {
                                            stringOfValues += attribute.value + ".0 ";
                                        } else {
                                            stringOfValues += attribute.value + " ";
                                        }
                                        // values.push(attribute.value);

                                    } else {
                                        if (attribute.value !== 0) {
                                            stringOfValues += '1 ';
                                        } else {
                                            stringOfValues += '0 ';
                                        }
                                    }
                                    writed = true;
                                    console.log("true: ", 1);
                                }

                            }
                        }
                        if (!writed && label.selected && data.format === 1) {
                            // if(labels.format===1){
                            // values.push(0.0);
                            stringOfValues += "0.0 ";
                            console.log("false: ", 0);
                            //}                  
                        } else if(!writed && label.selected && data.format === 0) {
                            stringOfValues += "0 ";
                            console.log("false: ", 0);
                        }
                    }
                    // console.log("values: ", values);
                    stringOfValues += "\r\n";
                } else {
                    console.log("NO DATA")
                }
            }
            archive.append(stringOfValues, { name: 'labels.txt' });
            resolve();
        });
    };

    export async function writeLabelNames(data: DownloadData, archive: any) {
        return new PromiseBlueBird(async (resolve, reject) => {
            let names: string = "List of labels: \r\n" ;
            for (let label of data.labels) {
                if (label.selected) {
                    names += label.labelName;
                    names += "\r\n";
                }
            }
            archive.append(names, { name: 'readme.txt' });
            resolve();
        });
    }

}