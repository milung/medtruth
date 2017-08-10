
import * as express from 'express';
import * as request from 'supertest';
import * as azure from 'azure-storage';
import * as fs from 'fs';

import { AzureStorage, AzureDatabase } from './azure-service';
import { routes } from './routes';
import { StatusCode, storagePath, imagePath } from './constants';
import { Db } from "mongodb";

// <Server> tests.
describe('<Server>', () => {
    // Setup a test server with the original routes.
    const server = express();
    server.use(express.static('public/'));
    server.use(routes);
    const req = request(server)

    it('should serve public', () => {
        return req.get('/')
            .expect(StatusCode.OK);
    });

    it('NotFound status for unknown route', () => {
        return req.get('/unknown/route')
            .expect(StatusCode.NotFound);
    })

    describe('<Services>', () => {
        describe('<AzureStorage>', () => {
            it('should be up', async (done) => {
                let status = await AzureStorage.upload('test', 'testblob', 'HG_001_0.dcm');
                expect(status).toBe(AzureStorage.Status.SUCCESFUL);
                await AzureStorage.blobService.deleteBlob('test', 'testblob', (err, res) => {
                    expect(err).toBeNull();
                    done();
                });
            });
        });

        describe('<AzureDatabase>', () => {
            var originalTimeout;
            beforeEach(function () {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            });
            it('should be up', async (done) => {
                let conn = await AzureDatabase.connect();
                expect(conn instanceof Db).toBeTruthy();
                AzureDatabase.close(conn);
                done();
            });

            it('removeFromAttributes should remove attributes', async (done) => {
                // given
                let db = await AzureDatabase.connect();
                let collection = await db.collection('test');
                await collection.deleteOne({ imageID: 'testImageID' });

                let imageAttributes: AzureDatabase.AttributeQuery = {
                    imageID: 'testImageID',
                    attributes: [
                        {
                            key: 'oko',
                            value: 1
                        },
                        {
                            key: 'hlava',
                            value: 0
                        }
                    ]
                };
                await collection.insertOne(imageAttributes);

                // when
                await AzureDatabase.removeFromAttributes('testImageID', ['hlava']);

                // then
                let result = await collection.findOne({ imageID: 'testImageID' });
                expect(result.attributes.find(elem => elem.key === 'hlava')).toBeUndefined();
                expect(result.attributes.find(elem => elem.key === 'oko')).toBeDefined();

                AzureDatabase.close(db);
                done();
            });

            it('putToLabels should put to collection of all labels or increment count', async (done) => {
                // given
                let db = await AzureDatabase.connect();
                let collection = await db.collection('test');
                await collection.deleteMany({});
                await collection.insertMany([
                    {
                        label: "oko",
                        count: 1
                    },
                    {
                        label: "koleno",
                        count: 2
                    }
                ]);

                // when
                await AzureDatabase.putToLabels(['oko', 'hlava']);

                // then
                let result = await collection.find().toArray();

                // created document
                expect(result.find(elem => elem.label === 'hlava')).toMatchObject({
                    label: "hlava",
                    count: 1
                });

                // incremented count
                expect(result.find(elem => elem.label === 'oko')).toMatchObject({
                    label: "oko",
                    count: 2
                });

                // not modified document
                expect(result.find(elem => elem.label === 'koleno')).toMatchObject({
                    label: "koleno",
                    count: 2
                });

                AzureDatabase.close(db);
                done();
            });

            it('removeFromLabels should remove from collection of all labels or decrement count', async (done) => {
                // given
                let db = await AzureDatabase.connect();
                let collection = await db.collection('test');
                await collection.deleteMany({});
                await collection.insertMany([
                    {
                        label: "oko",
                        count: 1
                    },
                    {
                        label: "hlava",
                        count: 2
                    },
                    {
                        label: "koleno",
                        count: 2
                    }
                ]);

                // when
                await AzureDatabase.removeFromLabels(['oko', 'hlava']);

                // then
                let result = await collection.find({}).toArray();

                // deleted document
                expect(result.find(elem => elem.label === 'oko')).toBeUndefined();

                // decremented count
                expect(result.find(elem => elem.label === 'hlava')).toMatchObject({
                    label: "hlava",
                    count: 1
                });

                // not modified document
                expect(result.find(elem => elem.label === 'koleno')).toMatchObject({
                    label: "koleno",
                    count: 2
                });

                AzureDatabase.close(db);
                done();
            });
            afterEach(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
        });
    });

    // <API> tests.
    describe('<API>', () => {
        it('/api responds to OPTIONS', () => {
            return req.options('/api')
                .expect(StatusCode.OK);
        });

        // <Uploads> tests.
        describe('<Upload>', () => {
            it('/upload responds to OPTIONS', () => {
                return req.options('/api/upload')
                    .expect(StatusCode.OK);
            });


            it('/upload sends a Conversion Error if invalid file', (done) => {
                return req.post('/api/upload')
                    .type('form')
                    .attach('data', 'tsconfig.json')
                    .then((res: request.Response) => {
                        expect(res.body.statuses[0].err).toBe("Conversion Error");
                        done();
                    });
            });

            it('/upload sends an upload status if valid file', (done) => {
                return req.post('/api/upload')
                    .type('form')
                    .attach('data', 'HG_001_0.dcm')
                    .then((res: request.Response) => {
                        expect(res.body.statuses[0].name).toBeDefined();
                        expect(res.body.statuses[0].id).toBeDefined();
                        expect(res.body.statuses[0].err).toBeNull();
                        done();
                    });
            });

            it('/upload sends upload statuses for more valid files', (done) => {
                return req.post('/api/upload')
                    .type('form')
                    .attach('data', 'HG_001_0.dcm')
                    .attach('data', 'HG_001_0.dcm')
                    .attach('data', 'HG_001_0.dcm')
                    .then((res: request.Response) => {
                        expect(res.body.statuses[0].err).toBeNull();
                        expect(res.body.statuses[1].err).toBeNull();
                        expect(res.body.statuses[2].err).toBeNull();
                        done();
                    });
            });

            it('/upload sends upload statuses for 2 valid files and 1 invalid', (done) => {
                return req.post('/api/upload')
                    .type('form')
                    .attach('data', 'HG_001_0.dcm')
                    .attach('data', 'tsconfig.json')
                    .attach('data', 'HG_001_0.dcm')
                    .then((res: request.Response) => {
                        expect(res.body.statuses[0].err).toBeNull();
                        expect(res.body.statuses[1].err).toBe("Conversion Error");
                        expect(res.body.statuses[2].err).toBeNull();
                        done();
                    });
            });

            it('/upload removes files after it has finished', (done) => {
                return req.post('/api/upload')
                    .type('form')
                    .attach('data', 'HG_001_0.dcm')
                    .then(async (res: request.Response) => {
                        expect(res.status).toBe(StatusCode.OK);
                        // We expect that both storagePath and imagePath contain .keep file.
                        await fs.readdir(storagePath, (err, files) => {
                            expect(err).toBeNull();
                            expect(files.length).toBe(1);
                            expect(files).toContainEqual('.keep');
                        });
                        await fs.readdir(imagePath, (err, files) => {
                            expect(err).toBeNull();
                            expect(files.length).toBe(1);
                            expect(files).toContainEqual('.keep');
                        });
                        done();
                    });
            });
        });

        // <Images> tests.
        describe('<Images>', () => {
            it('/images             responds to OPTIONS', () => {
                return req.options('/api/images')
                    .expect(StatusCode.OK);
            });

            it('/images/:id         NotFound status with invalid id', () => {
                return req.get('/api/images/847483218')
                    .expect(StatusCode.NotFound);
            });
        });
    });
});
