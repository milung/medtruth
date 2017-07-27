
import * as azure from 'azure-storage';
import * as request from 'request';
// import * as mongo from 'mongodb';

import { collectionName, StatusCode } from './constants';
import { db } from './server';

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
        return new Promise<Status>((resolve, reject) => {
            blobService.createBlockBlobFromLocalFile(container, blobName, filePath,
                (error, result, response) => {
                    if (error === null) resolve(Status.SUCCESFUL);
                    else reject(Status.FAILED);
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
        return new Promise<string>((resolve, reject) => {
            let sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Expiry: azure.date.minutesFromNow(60)
                },
            };

            let token = blobService.generateSharedAccessSignature(
                containerImages,
                image,
                sharedAccessPolicy);
            let sasUrl = blobService.getUrl(containerImages, image, token);
            request(sasUrl, (err, res) => {
                if (err) reject(Status.FAILED);
                if (res.statusCode === StatusCode.OK) resolve(sasUrl)
                reject(Status.FAILED);
            })
        });
    }
}
export namespace AzureDatabase {
    // const accountKey = 'a6GUPQQs8Cpg70cbHT4m2xy1LRseQsuMKofjRI0RU9iSZZW5vT7HQDDUVuibdwlXw9pJIrJ53TDqy32h5r0BAw==';
    export interface Image {
        seriesID: string,
        patientName: string,
        imageID: string,        // ID of the image in the series
        date: Date,             // When the image was created
        uploadDate: Date,
        uploadID: number,
        thumbnails: object[]       // Blob reference
    }
    export interface Upload {
        uploadID: number,
        uploadDate: Date,
        studies: Study[]
    }

    export interface Study {
        patientName: string,
        patientBirthday: Date,
        series: Series[]
    }

    export interface Series {
        seriesID: string,
        seriesDescription: string,
        images: string[]                    // Array of blob references
    }

    /**
     * Creates new document in the MongoDB database.
     * @param object 
     */
    export function insertDocument(object: Upload): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            let collection = await db.collection(collectionName);
            await collection.insert(object, (error, result) => {
                let message = "Inserted " + result.result.n + " object, ID: " + result.insertedId;
                console.log(result);
                if (error) reject(Status.FAILED);
                else resolve(Status.SUCCESFUL);
                console.log(message);
            })
        });
    }

    /**
     * Returns an array of JSON objects.
     * @param query 
     */
    export function getDocuments(query): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            let collection = await db.collection(collectionName);
            //var query = { patientName: "Hana Hahhahah" };
            await collection.find(query).toArray(function (err, result) {
                //let message = result;
                if (err) reject(Status.FAILED);
                else resolve(result);
                //console.log(result);
                console.log("Number of found objects: " + result.length);
                //db.close();
            });
        });
    }
}
