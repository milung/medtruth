
export enum ActionTypeKeys {
    FILES_UPLOADED = 'FILES_UPLOADED',
    THUMBNAIL_BLOWN_UP = 'THUMBNAIL_BLOWN_UP',
    THUMBNAIL_BLOWN_DOWN = 'THUMBNAIL_BLOWN_DOWN',
    OTHER_ACTION = 'OTHER_ACTION'
}

export interface FilesUploadedAction {
    type: ActionTypeKeys.FILES_UPLOADED;
    uploadID: number;
}

export interface ThumbnailBlownUpAction {
    type: ActionTypeKeys.THUMBNAIL_BLOWN_UP;
    thumbnailId: string;
}

export interface ThumbnailBlownDownAction {
    type: ActionTypeKeys.THUMBNAIL_BLOWN_DOWN;
}

export interface OtherAction {
    type: ActionTypeKeys.OTHER_ACTION;
}

export const filesUploaded = (uploadID: number): FilesUploadedAction => ({
    type: ActionTypeKeys.FILES_UPLOADED,
    uploadID
});

export const thumbnailBlownUp = (thumbnailId: string): ThumbnailBlownUpAction => ({
    type: ActionTypeKeys.THUMBNAIL_BLOWN_UP,
    thumbnailId
});

export const thumbnailBlownDown = (): ThumbnailBlownDownAction => ({
    type: ActionTypeKeys.THUMBNAIL_BLOWN_DOWN,
});

export type ActionType = 
    | FilesUploadedAction
    | OtherAction
    | ThumbnailBlownUpAction
    | ThumbnailBlownDownAction;
    