
import * as azure from 'azure-storage';
import * as request from 'request';
// import * as mongo from 'mongodb';

import { StatusCode } from './constants';

export namespace AzureStorage {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    export const blobService = azure.createBlobService(accountName, accountKey);
    export const containerDicoms = 'dicoms';
    export const containerImages = 'images';

    export enum Status {
        SUCCESFUL,
        FAILED
    }

    export function upload(container: string, blobName: string, filePath: string): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            await blobService.createBlockBlobFromLocalFile(container, blobName, filePath,
                (error, result, response) => {
                    if (error)     reject(Status.FAILED);  
                    else           resolve(Status.SUCCESFUL); 
                });
        });
    }

    export function toDicoms(blobName: string, filePath: string): Promise<Status> {
        return upload(containerDicoms, blobName, filePath);
    }

    export function toImages(blobName: string, filePath: string): Promise<Status> {
        return upload(containerImages, blobName, filePath);
    }

    export function getURLforImage(image: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            let sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Expiry: azure.date.minutesFromNow(60)
                },
            };

            let token = await blobService.generateSharedAccessSignature(
                containerImages, 
                image, 
                sharedAccessPolicy);
            let sasUrl = await blobService.getUrl(containerImages, image, token);
            await request(sasUrl, (err, res) => {
                if (err)                                reject(Status.FAILED);
                if (res.statusCode === StatusCode.OK)   resolve(sasUrl)
                reject(Status.FAILED);
            })
        });
    }
}

export namespace AzureDatabase {
    // const accountKey = 'a6GUPQQs8Cpg70cbHT4m2xy1LRseQsuMKofjRI0RU9iSZZW5vT7HQDDUVuibdwlXw9pJIrJ53TDqy32h5r0BAw==';
}
