
import * as azure from 'azure-storage';
import * as request from 'request';
import { StatusCode } from './constants';
import * as _ from 'lodash';
import * as stream from 'stream';
import * as PromiseBlueBird from 'bluebird';
//import { db } from './server';

import { MongoClient, Db, Collection, BulkWriteOpResultObject, FindAndModifyWriteOpResultObject, Cursor } from 'mongodb';
import { UploadJSON, StudyJSON, SeriesJSON, ImageJSON } from "./Objects";

export namespace AzureStorage {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    export const blobService = azure.createBlobService(accountName, accountKey);
    // blobService.logger.level = azure.Logger.LogLevels.DEBUG;  
    export const containerDicoms = 'dicoms';
    export const containerImages = 'images';
    // export const containerImages = 'test01';

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


    export function deleteImageAndThumbnail(image: string) {
        return new PromiseBlueBird(async (resolve, reject) => {
            try {
                let name = image + ".png";
                let thumbnail = image + "_.png";
                // delete image
                let imgPromimse = blobService.deleteBlobIfExists(containerImages, name, (error, result, response) => {
                });
                // delete thumbnail
                let thmbPromise = blobService.deleteBlobIfExists(containerImages, thumbnail, (error, result, response) => {
                });

                await PromiseBlueBird.all([imgPromimse, thmbPromise]);
                console.log('[deleted] ' + name);

                resolve();
            } catch (e) {
                console.log("service deleteImageAndThumbnail");

                console.log(e);

                reject({});
            }
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

    export function initialize(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                var connLabels = await connectToLabels();
                let indexExists: boolean = await connLabels.collection.indexExists("label_1");
                if (!indexExists) {
                    await connLabels.collection.createIndex({ label: 1 }, { unique: true, name: "label_1" });
                }

                indexExists = await connLabels.collection.indexExists("label_1");
                if (indexExists) {
                    console.log('created index label_1 on collection labels');
                    resolve();
                } else {
                    console.log('error: index label_1 on collection labels not created');
                    reject();
                }

                var connAttributes = await connectToAttributes();
                indexExists = await connAttributes.collection.indexExists("imageID_1");
                if (!indexExists) {
                    await connAttributes.collection.createIndex({ imageID: 1 }, { unique: true, name: "imageID_1" });
                }

                indexExists = await connAttributes.collection.indexExists("imageID_1");
                if (indexExists) {
                    console.log('created index imageID_1 on collection attributes');
                    resolve();
                } else {
                    console.log('error: index imageID_1 on collection attributes not created');
                    reject();
                }

            } catch (e) {
                console.log('error');
                console.log(e);
                reject();
            } finally {
                close(connLabels.db);
                close(connAttributes.db);
            }
        });
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


    export function updateToImageCollectionDB(object, db): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
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

    export function putAttributeToImages(imageIDs: string[], attribute: Attribute): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
                var conn = await connectToAttributes();
                let updateObjects = imageIDs.map(imageID => ({
                    updateOne: {
                        filter: { imageID },
                        update: {
                            $setOnInsert: {
                                attributes: [
                                    attribute
                                ]
                            }
                        },
                        upsert: true
                    },
                }));

                let result: BulkWriteOpResultObject = await conn.collection.bulkWrite(updateObjects);

                let addedAttributesCount = result.upsertedCount;

                let updateObjects2 = imageIDs.map(imageID => ({
                    updateOne: {
                        filter: {
                            imageID,
                            attributes: {
                                $not: {
                                    $elemMatch: {
                                        key: attribute.key
                                    }
                                }
                            }
                        },
                        update: {
                            $push: {
                                attributes: attribute
                            }
                        }
                    }
                }));

                result = await conn.collection.bulkWrite(updateObjects2);

                addedAttributesCount += result.modifiedCount;

                let updateObjects3 = imageIDs.map(imageID => ({
                    updateOne: {
                        filter: {
                            imageID,
                            "attributes.key": attribute.key
                        },
                        update: {
                            $set: {
                                "attributes.$.value": attribute.value
                            }
                        }
                    }
                }));

                result = await conn.collection.bulkWrite(updateObjects3);

                await putToLabels2(attribute.key, addedAttributesCount);
                resolve();
            } catch (e) {
                console.log(e);
                reject();
            } finally {
                close(conn.db);
            }
        });
    }

    export function removeFromAttributes(id, labelsToRemove: string[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                var conn = await connectToAttributes();
                let origResult = null;

                try {
                    labelsToRemove.forEach(label => {
                        if (origResult == null) {
                            origResult = removeLabelFromAttribute(id, label, conn);
                        } else {
                            removeLabelFromAttribute(id, label, conn);
                        }
                    });

                } catch (error) {
                    console.log("CATCH");
                    console.log(error);
                    reject();
                }


                if (origResult.value === undefined) {
                    resolve();
                    return;
                }

                let originalLabels = origResult.value.attributes.map(attr => attr.key);
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

    function removeLabelFromAttribute(id, labelToRemove: string, conn: Connection): Promise<void> {
        return new Promise<any>(async (resolve, reject) => {
            let filter = { imageID: id };
            let update = {
                $pull: {
                    attributes: {
                        key: labelToRemove
                    }
                }
            };
            let options = {
                returnOriginal: true
            };
            try {
                let result = await conn.collection.findOneAndUpdate(filter, update, options);
                resolve(result);
            } catch (e) {
                console.log("CATCH");
                console.log(e);
                reject();
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
    * Returns Upload document with a specific ID.
    * @param patientID
    */
    export function getPatientDocumentDB(patientID: string, db): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {

                let query = { patientID: String(patientID) };
                let collection = await db.collection('images');

                let result = await collection.findOne(query);
                if (result) resolve(result);
                else resolve(result);
            } catch (e) {
                reject(Status.FAILED);
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
                let result: UploadJSON = await conn.collection.findOne(query);

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

    export function putToLabels2(label: string, count: number): Promise<Status> {
        return new Promise<Status>(async (resolve, reject) => {
            try {
                var conn = await connectToLabels();
                let result = await conn.collection.updateOne(
                    {
                        label
                    },
                    {
                        $inc: {
                            count: count
                        }
                    },
                    {
                        upsert: true
                    }
                );

                if (result.result.ok) {
                    resolve(Status.SUCCESFUL);
                } else {
                    reject();
                }

            } catch (e) {
                reject();
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

    /**
     * Remove everything from MongoDB and Azure Blob Storage
     */
    export function removeAll(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            // Delete everything from attributes MongoDB collection 
            await removeFromCollection('attributes');
            // Delete everything from labels MongoDB collection
            await removeFromCollection('labels');
            // Delete everything from images MongoDB collection
            await removeFromCollection('images');

            resolve();

            // // Drop the whole mongoDB database
            // console.log('droping database');
            // let db = await connect();
            // try {
            //     let result = await db.dropDatabase();
            //     console.log('result', result);
            //     resolve(result);
            // } catch (e) {
            //     reject();
            // }
        });
    }

    export function removeFromCollection(collection: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            var conn;
            try {
                switch (collection) {
                    case 'attributes':
                        conn = await connectToAttributes();
                        break;
                    case 'labels':
                        conn = await connectToLabels();
                        break;
                    case 'images':
                        conn = await connectToImages();
                        break;
                    default:
                        break;
                }
                // var conn = await connectToLabels();
                let result = await conn.collection.deleteMany({});
                console.log(result);
                resolve();
            } catch (e) {
                reject({});
            } finally {
                close(conn.db);
            }
        });
    }

    /** 
     * Remove patient's document from MongoDB
     */
    export function removePatient(patient: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let filter = { patientID: patient };

            try {
                var conn = await connectToImages();
                let result = await conn.collection.remove(filter);
                console.log('SUCCESSFULLY REMOVED PATIENT', result);
                resolve();
            } catch (e) {
                reject({});
            } finally {
                close(conn.db);
            }
        })
    };

    /** 
     * Remove particular study of a particular patient
     */
    export function removePatientsStudy(patient: string, study: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let filter = { patientID: patient };
            let update = {
                $pull: {
                    studies: {
                        studyID: study
                    }
                }
            };
            let options = {
                returnOriginal: false
            };
            try {
                var conn = await connectToImages();
                let result = await conn.collection.findOneAndUpdate(filter, update, options);
                resolve(result);
            } catch (e) {
                reject();
            }
        });
    }

    /**
     * Remove particular series from patient's study
     * @param patientID 
     * @param studyID 
     * @param seriesID 
     */
    export function removeStudySeries(patientID: string, studyID: string, seriesID: string): Promise<any> {
        console.log('PATIENT ' + patientID + ' STUDY ' + studyID + ' SERIES ' + seriesID);
        return new Promise<any>(async (resolve, reject) => {
            let filter = { patientID: patientID };
            try {
                var conn = await connectToImages();
                // Get the old document
                let oldDocument: UploadJSON = await conn.collection.findOne(filter);
                let newDocument: UploadJSON = oldDocument;
                let newSeries: SeriesJSON[] = [];
                for (var studyIndex in newDocument.studies) {
                    // Find the study
                    var study = newDocument.studies[studyIndex];
                    if (study.studyID === studyID) {
                        console.log('study found');
                        // Find the series
                        let index: number = study.series.findIndex(series =>
                            series.seriesID === seriesID
                        );
                        // Remove the series from the array of series
                        if (index !== -1) {
                            console.log('series found');
                            newSeries =
                                [...study.series.slice(0, index),
                                ...study.series.slice(index + 1)];
                        }
                        // Set new series
                        newDocument.studies[studyIndex].series = newSeries;
                    }
                }
                let result = await conn.collection.findOneAndReplace(filter, newDocument);
                resolve();
            } catch (e) {
                reject();
            }
        })
    };

    export function removeSeriesImage(patientID: string, studyID: string, seriesID: string, imageID: string): Promise<any> {
        console.log('PATIENT ' + patientID + ' STUDY ' + studyID + ' SERIES ' + seriesID + ' IMAGE ' + imageID);
        return new Promise<any>(async (resolve, reject) => {
            let filter = { patientID: patientID };
            try {
                var conn = await connectToImages();
                // Get the old document
                let oldDocument: UploadJSON = await conn.collection.findOne(filter);
                let newDocument: UploadJSON = oldDocument;
                let newImages: ImageJSON[] = [];
                for (var studyIndex in newDocument.studies) {
                    var study = newDocument.studies[studyIndex];
                    // Find the study
                    if (study.studyID === studyID) {
                        console.log('study found');
                        for (var seriesIndex in study.series) {
                            // Find the series
                            if (study.series[seriesIndex].seriesID === seriesID) {
                                console.log('series found');
                                // Find the image
                                let index: number = study.series[seriesIndex].images.findIndex(image =>
                                    image.imageID === imageID
                                );
                                // Remove the image from the array of images
                                if (index !== -1) {
                                    console.log('image found');
                                    newImages =
                                        [...study.series[seriesIndex].images.slice(0, index),
                                        ...study.series[seriesIndex].images.slice(index + 1)];
                                }
                                // Set new images
                                newDocument.studies[studyIndex].series[seriesIndex].images = newImages;
                            }
                        }
                    }
                }
                let result = await conn.collection.findOneAndReplace(filter, newDocument);
                resolve();
            } catch (e) {
                reject();
            }
        })
    };

    export function deleteAllPatients() {
        return new Promise(async (resolve, reject) => {
            try {
                var conn = await connectToImages();
                conn.collection.remove({});
                resolve();
            } catch (e) {
                reject({});
            } finally {
                close(conn.db);
            }
        });
    }


}
