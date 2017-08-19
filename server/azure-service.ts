
import * as azure from 'azure-storage';
import * as request from 'request';
import { StatusCode } from './constants';
import * as _ from 'lodash';
import * as stream from 'stream';
import * as PromiseBlueBird from 'bluebird';
//import { db } from './server';

import { MongoClient, Db, Collection, BulkWriteOpResultObject, FindAndModifyWriteOpResultObject, Cursor } from 'mongodb';
import { UploadJSON } from "./Objects";

export namespace AzureStorage {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    export const blobService = azure.createBlobService(accountName, accountKey);
    //blobService.logger.level = azure.Logger.LogLevels.DEBUG;  
    export const containerDicoms = 'dicoms';
    export const containerImages = 'images';
    //export const containerImages = 'test01';

    


    export enum Status {
        SUCCESFUL,
        FAILED
    }

    export function upload(container: string, blobName: string, filePath: string): PromiseBlueBird<Status> {
        return new PromiseBlueBird<Status>((resolve, reject) => {
            blobService.createBlockBlobFromLocalFile(container, blobName, filePath,
                (error, result, response) => {
                    if (error === null) {
                        console.log(blobName + " in azure storage [i]");
                        resolve(Status.SUCCESFUL);
                    }
                    else {
                        console.log(error);
                        reject(Status.FAILED);
                    }
                });
        });
    }


    export function toDicoms(blobName: string, filePath: string): PromiseBlueBird<Status> {
        return upload(containerDicoms, blobName, filePath);
    }

    export function toImages(blobName: string, filePath: string): PromiseBlueBird<Status> {
        return upload(containerImages, blobName, filePath);
    }

    export function toTest(blobName: string, filePath: string): PromiseBlueBird<Status> {
        return upload('test01', blobName, filePath);
    }

    export function uploadStream(container: string, blobName: string, buffer: Buffer): Promise<Status> {
        return new Promise<Status>((resolve, reject) => {
            var bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);
            blobService.createBlockBlobFromStream(container, blobName, bufferStream, buffer.byteLength,
                (error, result, response) => {
                    if (error === null) {
                        console.log(blobName + " in azure storage[t]");
                        resolve(Status.SUCCESFUL);
                    }
                    else {
                        console.log(blobName + " failed");
                        reject(Status.FAILED);
                    }
                });
        });
    }

    export function toImagesBuffer(blobName: string, buffer: Buffer): Promise<Status> {
        return uploadStream(containerImages, blobName, buffer);
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
    //export const url = urlMedTruth;
    export const url = (process.argv[2] === 'local' || process.env.NODE_ENV === 'development') ? "mongodb://" + localAddress + localName : urlMedTruth;
    //export const url = "mongodb://" + localAddress + localName;

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
                    if (error) {
                        console.log('error');
                        console.log(error);
                        reject(Status.FAILED);
                    }
                    else resolve(Status.SUCCESFUL);
                });
            } catch (e) {
                console.log('error');
                console.log(e);
                reject(Status.FAILED);
            } finally {
                close(db);
            }
        });
    }

    export function insertToImagesCollection(object): Promise<Status> {
        return insertDocument(object, 'images');
    }

    export function updateToImageCollection(object): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
                var db = await connect();
                let collection = await db.collection('images');
                let query = { patientID: String(object.patientID) };
                await collection.update(query, object,
                    {
                        upsert: true
                    }, (error, result) => {
                        if (error) {
                            console.log('error');
                            console.log(error);
                            reject(Status.FAILED);
                        }
                        else {

                            resolve(Status.SUCCESFUL);
                        }
                    });
            } catch (e) {
                console.log('error');
                console.log(e);
                reject(Status.FAILED);
            } finally {
                close(db);
            }
        });
    }

    export function getAllPatients() {
        return new Promise<any>(async (resolve, reject) => {
            try {
                var db = await connect();
                let collection = await db.collection('images');

                let query = { patientID: { $exists: true } };
                let result = await collection.find(query);

                resolve(result.toArray());

            } catch (e) {
                reject({});
            } finally {
                close(db);
            }
        });
    }

    interface Attribute {
        key: string;
        value: number;
    }

    export interface AttributeQuery {
        imageID: string;
        attributes: Attribute[];
    }

    // export interface ImagesWithAttributesQuery {
    //     imageIDs: string[];
    // }

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
    * Returns Upload document with a specific ID.
    * @param patientID
    */
    export function getPatientDocument(patientID: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                var conn = await connectToImages();

                let query = { patientID: String(patientID) };

                let result = await conn.collection.findOne(query);
                if (result) resolve(result);
                else resolve(result);
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
        uploadID: number;
        studyID: string;
        seriesID: string;
    }

    interface SeriesImage {
        imageID: string;
        imageNumber: number;
    }

    export function getImagesBySeriesId(req: SeriesRequest): Promise<SeriesImage[]> {
        return new Promise<SeriesImage[]>(async (resolve, reject) => {
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

            if (!labels || labels.length === 0) {
                resolve(Status.SUCCESFUL);
                return;
            }

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

    /**
     * Get the list of names of all images that have assigned at least one attribute. 
     */
    export function getImagesWithLabels(): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                var conn = await connectToAttributes();
                let images: string[] = [];
                let result = await conn.collection.find().toArray();
                for (var image of result) {
                    images.push(image.imageID);
                }
                if (result) {
                    resolve(images);
                } else resolve([]);
            } catch (e) {
                reject({});
            } finally {
                close(conn.db);
            }
        });
    }
}
