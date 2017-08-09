
import * as azure from 'azure-storage';
import * as request from 'request';
import { StatusCode } from './constants';
import * as _ from 'lodash';
//import { db } from './server';

import { MongoClient, Db, Collection, BulkWriteOpResultObject, FindAndModifyWriteOpResultObject } from 'mongodb';
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
                if (res == null) reject(Status.FAILED);
                if (res.statusCode === StatusCode.OK) resolve(sasUrl)
                reject(Status.FAILED);
            })
        });
    }
}

export namespace AzureDatabase {
    export const localAddress = "localhost:27017/";
    export const localName = "medtruth";
    export const urlMedTruth = "mongodb://medtruthdb:5j67JxnnNB3DmufIoR1didzpMjl13chVC8CRUHSlNLguTLMlB616CxbPOa6cvuv5vHvi6qOquK3KHlaSRuNlpg==@medtruthdb.documents.azure.com:10255/?ssl=true";
    export const url = process.argv[2] === 'local' ? "mongodb://" + localAddress + localName : urlMedTruth;

    export enum Status {
        SUCCESFUL,
        FAILED
    }

    interface Connection {
        db: Db,
        collection: Collection
    }

    /**
     * Initialize connection to MongoDB.
     */
    export function connect(): Promise<Db> {
        return new Promise<Db>(async (resolve, reject) => {
            MongoClient.connect(url, function (err, database) {
                if (err) reject(null)
                else resolve(database);
            });
        });
    }

    async function connectToImages(): Promise<Connection> {
        let db = await connect();
        let collection = await db.collection('images');
        return { db: db, collection: collection };
    }

    async function connectToAttributes(): Promise<Connection> {
        let db = await connect();
        let collection = await db.collection('attributes');
        return { db: db, collection: collection };
    }

    async function connectToLabels(): Promise<Connection> {
        let db = await connect();
        let collection = await db.collection('labels');
        return { db: db, collection: collection };
    }

    // Close the database only if it's not null.
    export function close(db: Db): void {
        if (db) db.close();
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

    export function putToAttributes(id, ...attributes: Attribute[]): Promise<AttributeQuery> {
        return new Promise<AttributeQuery>(async (resolve, reject) => {
            try {
                var conn = await connectToAttributes();
                // First we look for an equal image ID.
                let query = { imageID: id };
                let result: AttributeQuery = await conn.collection.findOne(query);
                // If we found an equal image ID, we update the attribute contents.
                if (result) {
                    // Merge the result with new attributes. If the keys are the same,
                    // only the values will be overwritten.
                    // Else it creates a new key with a value.
                    let updatedAttributes = _({}).merge(
                        _(result.attributes).groupBy('key').value(),
                        _(attributes).groupBy('key').value()
                    ).values().flatten().value() as Attribute[];
                    // Updates the result query.
                    let updatedResult: AttributeQuery = { imageID: id, attributes: updatedAttributes };
                    await conn.collection.updateOne(result, updatedResult);
                    await putToLabels(
                        _(attributes.map(attr => attr.key))
                            .difference(result.attributes.map(attr => attr.key))
                            .value()
                    );
                    // Returns the updated result.
                    resolve(updatedResult);
                    // If the query does not exist, we create a brand new one.
                } else {
                    let newResult = { imageID: id, attributes };
                    await conn.collection.insertOne(newResult);
                    await putToLabels(attributes.map(attr => attr.key));
                    // Returns the new result.
                    resolve(newResult);
                }
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }

    export function removeFromAttributes(id, labelsToRemove: string[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                var conn = await connectToAttributes();

                let filter = { imageID: id };
                let update = {
                    $pull: {
                        attributes: {
                            key: {
                                $in: labelsToRemove
                            }
                        }
                    }
                };
                let options = {
                    returnOriginal: true
                };
                let result: FindAndModifyWriteOpResultObject<any>
                    = await conn.collection.findOneAndUpdate(filter, update, options);

                if (!result.ok) {
                    reject();
                    return;
                }

                if (result.value === undefined) {
                    resolve();
                    return;
                }

                let originalLabels = result.value.attributes.map(attr => attr.key);
                let removedLabels: string[] = _(originalLabels).intersection(labelsToRemove).value();
                removeFromLabels(removedLabels);
                resolve();
            } catch (e) {
                reject();
            } finally {
                close(conn.db);
            }
        });
    }

    export function getAttributes(id): Promise<AttributeQuery> {
        return new Promise<AttributeQuery>(async (resolve, reject) => {
            try {
                var conn = await connectToAttributes();

                // First we look for an equal image ID.
                let query = { imageID: id };
                let result: AttributeQuery = await conn.collection.findOne(query);
                // If we found an equal image ID, we update the attribute contents.
                if (result) {
                    resolve(result);
                }
                else resolve({} as AttributeQuery);
            } catch (e) {
                reject({});
            } finally {
                close(conn.db);
            }
        });
    }

    /**
     * Returns Upload document with a specific ID.
     * @param uploadID
     */
    export function getUploadDocument(uploadID: number): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                var conn = await connectToImages();

                let query = { uploadID: Number(uploadID) };
                let result = await conn.collection.findOne(query);
                if (result) resolve(result);
                else reject(Status.FAILED);
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }

    /**
     * Returns JSON object of the last Upload document in MongoDB.
     */
    export function getLastUpload(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                var conn = await connectToImages();

                await conn.collection.find({}).sort({ "uploadDate": -1 }).limit(1).toArray((err, result) => {
                    if (err) reject(Status.FAILED);
                    resolve(result[0]);
                });
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }

    /* 
        GetImagesBySeriesID returns all images by it's series ID.
    */
    interface SeriesRequest {
        uploadID:   number;
        studyID:    string;
        seriesID:   string;
    }
    
    interface SeriesImages {
        images: string[];
    }

    export function getImagesBySeriesId(req: SeriesRequest): Promise<SeriesImages> {
        return new Promise<SeriesImages>(async (resolve, reject) => {
            try {
                var conn = await connectToImages();
                let query = { uploadID: req.uploadID };
                let result = await conn.collection.findOne(query);
                
                // TODO: Refactor!
                if (result) {
                    if (result.studies) {
                        _.forEach(result.studies, (study) => {
                            if (study.studyID === req.studyID) {
                                if (study.series) {
                                    _.forEach(study.series, (serie) => {
                                        if (serie.seriesID === req.seriesID) {
                                            if (serie.images) {
                                                resolve(serie.images);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                // If we didn't find a result by the query.
                reject(Status.FAILED);
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }

    export function removeFromLabels(labels: string[]): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
                var conn = await connectToLabels();

                // remove where count is equal 1
                await conn.collection.deleteMany({
                    label: {
                        $in: labels
                    },
                    count: 1
                });

                // decrement count
                let updateObjects: {}[] = labels.map(label => {
                    return {
                        updateOne: {
                            filter: {
                                label,
                            },
                            update: {
                                $inc: { count: -1 }
                            }
                        }
                    }
                });

                await conn.collection.bulkWrite(updateObjects);
                resolve(Status.SUCCESFUL);
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }

    export function putToLabels(labels: string[]): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {

            if (!labels || labels.length === 0) {
                resolve(Status.SUCCESFUL);
                return;
            }

            try {
                var conn = await connectToLabels();
                let updateObjects = labels.map(label => {
                    return {
                        updateOne: {
                            filter: {
                                label
                            },
                            update: {
                                $inc: { count: 1 }
                            },
                            upsert: true
                        }
                    }
                });
                let result: BulkWriteOpResultObject = await conn.collection.bulkWrite(updateObjects);
                resolve(Status.SUCCESFUL);
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }

    export function getLabels(): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                var conn = await connectToLabels();

                let labels = await conn.collection
                    .find({ count: { $gt: 0 } })
                    .map(lab => lab.label)
                    .toArray();

                if (labels) {
                    resolve(labels);
                } else {
                    reject(Status.FAILED);
                }
            } catch (e) {
                reject(Status.FAILED);
            } finally {
                close(conn.db);
            }
        });
    }
}
