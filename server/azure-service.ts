
import * as azure from 'azure-storage';
// import * as mongo from 'mongodb';

export namespace AzureStorage {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    const blobService = azure.createBlobService(accountName, accountKey);
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
                    if (!error)     resolve(Status.SUCCESFUL);  
                    else            reject(Status.FAILED); 
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
            var startDate = new Date();
            var expiryDate = new Date(startDate);
            startDate.setMinutes(startDate.getMinutes() - 10);
            expiryDate.setMinutes(startDate.getMinutes() + 10);

            var sharedAccessPolicy = {
                AccessPolicy: {
                    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                    Start: startDate,
                    Expiry: expiryDate
                },
            };

            var token = await blobService.generateSharedAccessSignature(containerImages, image, sharedAccessPolicy);
            var sasUrl = await blobService.getUrl(containerImages, image, token);
            resolve(sasUrl);
        });
    }
}

export namespace AzureDatabase {
    // const accountKey = 'a6GUPQQs8Cpg70cbHT4m2xy1LRseQsuMKofjRI0RU9iSZZW5vT7HQDDUVuibdwlXw9pJIrJ53TDqy32h5r0BAw==';
}
