
import * as azure from 'azure-storage';
// import * as mongo from 'mongodb';

export namespace AzureStorage {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    const blobService = azure.createBlobService(accountName, accountKey);
    export const containerDicoms = 'dicoms';
    export const containerImages = 'images';

    export function upload(container: string, blobName: string, filePath: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            await blobService.createBlockBlobFromLocalFile(container, blobName, filePath,
            (error, result, response) => {
                let message = "Created: " + result.name + ", exists: " + result.exists + ", is successful: " + response.isSuccessful; 
                if (!error) {
                    resolve(message);
                } else {
                    reject(message);
                }
            });
        });
    }
}

export namespace AzureDatabase {
    // const accountKey = 'a6GUPQQs8Cpg70cbHT4m2xy1LRseQsuMKofjRI0RU9iSZZW5vT7HQDDUVuibdwlXw9pJIrJ53TDqy32h5r0BAw==';
}
