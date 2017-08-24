import * as PromiseBB from 'bluebird';
import * as sharp from 'sharp';
import { AzureStorage } from "../azure-service";
import { imagePath } from "../constants";

interface BlobUpload {
    id: string;
    resolve: (state: boolean) => void;
    reject: (state: boolean) => void;

}

export class BlobStorageUploader {
    private promises: BlobUpload[];
    private uploadDONE: boolean;
    private promiseRunning: number;
    private maxPromiseRunning: number;
    private successfulUploads;
    private onDone;
    private finished: boolean;
    constructor(onDone: () => void) {
        this.promises = [];
        this.uploadDONE = false;
        this.promiseRunning = 0;
        this.maxPromiseRunning = 10;
        this.successfulUploads = 0;
        this.onDone = onDone;
        this.finished = false
    }

    public async promiseAdded() {
        if (this.promises.length > 0 && this.promiseRunning < this.maxPromiseRunning) {
            this.promiseRunning++;
            // pop promise to be executed
            let uploadblob = this.promises.shift();
            // if promise is legit
            if (uploadblob != undefined) {
                // upload to azure, if failed resolve fail
                try {
                    await this.uploadImageToAzure(uploadblob.id);
                    uploadblob.resolve(true);
                    console.log("AZURE OK" + uploadblob.id);
                    this.successfulUploads++;
                } catch (error) {
                    uploadblob.resolve(false);
                } finally {
                    this.promiseRunning--;
                    console.log('done: ' + this.successfulUploads);
                    this.promiseAdded();
                }
            } else {
                this.promiseRunning--;
                this.promiseAdded();
            }
        }
        this.checkEndOfExecution();
    }

    public upload(id: string, uploadDONE: boolean) {
        return new PromiseBB<boolean>(async (resolve, reject) => {
            this.promises.push({ id, resolve, reject });
            console.log("SETTING this.uploadDONE", this.uploadDONE);

            this.uploadDONE = uploadDONE;
            this.promiseAdded();
        });
    }


    public uploadImageToAzure = (imageID: string) => {
        return new PromiseBB<boolean>(async (resolve, reject) => {
            let imagePromise = this.uploadImage(imageID)
            let thumbnailPromise = this.createThumbnailSharp(imageID);
            try {
                let promise = await PromiseBB.all([imagePromise, thumbnailPromise]);
                console.log(imageID + " uploaded ");
                resolve(true);
            } catch (e) {
                if (imagePromise.isRejected()) {
                    console.log("imagePromise rejected");
                    try {
                        let secondPromiseImage = this.uploadImage(imageID)
                        await secondPromiseImage; resolve(true);
                    } catch (e) { resolve(false) };

                }
                if (thumbnailPromise.isRejected()) {
                    console.log("thumbnailPromise rejected");
                    try {
                        let secondPromiseThumbnail = this.createThumbnailSharp(imageID)
                        await secondPromiseThumbnail; resolve(true);
                    } catch (e) { resolve(false) };
                }
            }
        });
    }

    public uploadImage = (imageID: string) => {
        return new PromiseBB(async (resolve, reject) => {
            let pngPath: string = imagePath + imageID + ".png";
            try {
                await AzureStorage.toImages(imageID + ".png", pngPath);
                resolve("OK");
            } catch (e) {
                reject("NOT OK");
            }
        });
    }

    public createThumbnailSharp = (imageID): PromiseBB<string> => {
        return new PromiseBB<string>((resolve, reject) => {
            let pngPath: string = imagePath + imageID + ".png";
            sharp(pngPath)
                .resize(300, 300)
                .background({ r: 0, g: 0, b: 0, alpha: 1 })
                .embed()
                .png()
                .toBuffer()
                .then(async data => {
                    try {
                        await AzureStorage.toImagesBuffer(imageID + '_.png', data);
                        resolve("OK");
                    } catch (e) {
                        reject("NOT OK");
                    }
                })
                .catch(err => {
                    reject("NOT OK");
                });
        });
    }

    public setUploadDone = (uploadDONE: boolean) => {
        this.uploadDONE = uploadDONE;
        this.checkEndOfExecution();
    };

    checkEndOfExecution = () => {
        // if we are finish and onDone was never called before we done
        if (this.promises.length == 0 && this.promiseRunning == 0 &&
            this.uploadDONE && this.finished == false) {
            this.finished = true;
            this.onDone();
        }
    }
}