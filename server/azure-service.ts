
import * as azure from 'azure-storage';
import { Promise } from 'es6-promise';
import { storagePath } from './constants';

export namespace AzureStorage {
    const accountName = 'medtruth';
    const accountKey = 'fKbRBTAuaUOGJiuIXpjx2cG4Zgs2oZ2wYgunmRdNJ92oMdU1HbRjSv89JtLnmXS+LhlT0SzLMzKxjG/Vyt+GSQ==';
    const container = 'dicoms';

    export function upload(blobName: string, fileName: string): Promise<string> {
        const blobService = azure.createBlobService(accountName, accountKey);
        let filePath = storagePath + fileName;
        let message: string = "";

        return new Promise<string>((resolve, reject) => {
            blobService.createBlockBlobFromLocalFile(container, blobName, filePath,
                (error, result, response) => {
                    if (!error) {
                        message = 'File ' + filePath + ' uploaded as ' + blobName;
                        resolve(message);
                    } else {
                        message = error.message;
                        reject(message);
                    }
                });
        });
    }
}
