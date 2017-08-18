import * as sharp from 'sharp';
import { getThumbnailImageURL } from '../constants';
import * as request from 'request';
import * as PromiseBlueBird from 'bluebird';

export interface conversionStatus {
    imageID: string;
    converted: boolean
}

export namespace ImageOperations {
    export function convertImages(images: string[], zip: any): PromiseBlueBird<conversionStatus[]> {
        return new PromiseBlueBird<conversionStatus[]>(async (resolve, reject) => {
            let promises = PromiseBlueBird.map(images, (imageId) => {
                return new PromiseBlueBird<conversionStatus>((resolve, reject) => {
                    let url = getThumbnailImageURL(imageId);
                    var requestSettings = {
                        method: 'GET',
                        url: url,
                        encoding: null
                    };
                    request(requestSettings, function (error, response, body) {
                        if (error || body == undefined) reject({ imageID: imageId, converted: false });
                        try {
                            let imageInstance = sharp(body);
                            let resized = imageInstance.resize(128, 128);
                            let buffer = resized.toBuffer();
                            buffer.then(data => {
                                zip.append(data, { name: "/data/" + imageId+'.png' });
                                resolve({ imageID: imageId, converted: true });
                            })
                                .catch(e => {
                                    reject({ imageID: imageId, converted: false });
                                });
                        } catch (e) { reject({ imageID: imageId, converted: false }); }
                    });

                }).reflect();
            }, { concurrency: 10 });


            let status: conversionStatus[] = [];
            await PromiseBlueBird.all(promises).each((inspection: PromiseBlueBird<conversionStatus>) => {
                if (inspection.isRejected()) {
                    status.push(inspection.reason());
                }
                if (inspection.isFulfilled()) {
                    status.push(inspection.value());
                }

            });
            console.log("RESOLVED");

            resolve(status);



        });
    }
}