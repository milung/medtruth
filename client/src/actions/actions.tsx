
export enum ActionTypeKeys {
    FILES_UPLOADED = 'FILES_UPLOADED',
    OTHER_ACTION = 'OTHER_ACTION'
}

export interface FilesUploadedAction {
    type: ActionTypeKeys.FILES_UPLOADED;
    uploadID: number;
}

export interface OtherAction {
    type: ActionTypeKeys.OTHER_ACTION;
}

export const filesUploaded = (uploadID: number): FilesUploadedAction => ({
    type: ActionTypeKeys.FILES_UPLOADED,
    uploadID
});

export type ActionType = 
    | FilesUploadedAction
    | OtherAction;
    