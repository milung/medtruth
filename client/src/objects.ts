
export class TerminatedUpload{
    _id: number;
    filesStatus: UploadStatus[];
}

export interface UploadStatus {
    fileName: string;
    id: string;
    fileStatus: FileStatus;
}

export enum FileStatus {
    OK,
    CONVERSION_FAIL,
    FILE_ALREADY_EXISTS,
    AZURE_STORAGE_FAIL,
    DATABASE_CONNECTION_FAIL
}