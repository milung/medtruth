
import * as azure from 'azure-storage';
import * as request from 'request';
import { StatusCode } from './constants';
import * as _ from 'lodash';
//import { db } from './server';

import { MongoClient, Db } from 'mongodb';
import { UploadJSON } from "./Objects";

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
    export const localAddress = "localhost:27017";
    export const localName = "/myproject";
    //export const localName = "/medtruth";
    //export const url = "mongodb://" + localAddress + localName;
    export const url = "mongodb://medtruthdb:5j67JxnnNB3DmufIoR1didzpMjl13chVC8CRUHSlNLguTLMlB616CxbPOa6cvuv5vHvi6qOquK3KHlaSRuNlpg==@medtruthdb.documents.azure.com:10255/?ssl=true";

    export enum Status {
        SUCCESFUL,
        FAILED
    }

    // Close the database only if it's not null.
    function close(ref: Db): void {
        if (ref) ref.close();
    }

    /**
     * Initialize connection to MongoDB.
     */
    function connect(): Promise<Db> {
        return new Promise<Db>(async (resolve, reject) => {
            MongoClient.connect(url, function (err, database) {
                if (err) reject(null)
                else resolve(database);
            });
        });
    }

    /**
     * Creates new document in the MongoDB database.
     * @param object 
     */
    export function insertDocument(object, collectionName: string): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
                var db = await connect();
                let collection = await db.collection(collectionName);
                await collection.insert(object, (error, result) => {
                    if (error) reject(Status.FAILED);
                    else resolve(Status.SUCCESFUL);
                });
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(db);
            }
        });
    }

    export function insertToImagesCollection(object): Promise<Status> {
        return insertDocument(object, 'images');
    }

    interface Attribute {
        key: string;
        value: number;
    }

    interface AttributeQuery {
        imageID: string;
        attributes: Attribute[];
    }
    export function insertToAttributesCollection(id, ...attributes: Attribute[]): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
                var db = await connect();
                let collection = await db.collection('attributes');
                // First we look for an equal image ID.
                let query = { imageID: id };
                let result: AttributeQuery = await collection.findOne(query);
                // If we found an equal image ID, we update the attribute contents.
                if (result) {
                    // Merge the queries and new attributes. If the keys are the same,
                    // only the values will be overwritten.
                    // Else it creates a new key with a value.
                    let updatedAttributes = _({}).merge(
                        _(result.attributes).groupBy('key').value(),
                        _(attributes)       .groupBy('key').value()
                    ).values().flatten().value();
                    // Updates the result query.
                    await collection.updateOne(result, { imageID: id, attributes: updatedAttributes });
                // If the query does not exist, we create a brand new one.
                } else {
                    await collection.insertOne({ imageID: id, attributes });
                }
                resolve(Status.SUCCESFUL);
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(db);
            }
        });
    }

    /**
     * Returns an array of JSON objects.
     * @param query 
     */
    export function getUploadDocument(uploadID: number): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                var db = await connect();
                let query = { uploadID: Number(uploadID) };
                let collection = await db.collection('images');
                let result = await collection.findOne(query);
                resolve(result);
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(db);
            }
        });
    }

    /**
     * Returns JSON object of the last upload document in MongoDB.
     */
    export function getLastUpload(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                var db = await connect();
                let collection = await db.collection('images');
                await collection.find({}).sort({ "uploadDate": -1 }).limit(1).toArray(function (err, result) {
                    if (err) reject(Status.FAILED);
                    resolve(result[0]);
                });
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(db);
            }
        });
    }
}
