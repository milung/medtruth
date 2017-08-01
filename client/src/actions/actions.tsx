
export enum ActionTypeKeys {
    FILES_UPLOADED = 'FILES_UPLOADED',
    THUMBNAIL_BLOWN_UP = 'THUMBNAIL_BLOWN_UP',
    THUMBNAIL_BLOWN_DOWN = 'THUMBNAIL_BLOWN_DOWN',
    IMAGES_SELECTED = 'IMAGES_SELECTED',
    IMAGE_SELECTED = 'IMAGE_SELECTED',
    IMAGE_ANNOTATION_ADDED = 'IMAGE_ANNOTATION_ADDED',
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

export interface ImagesSelectedAction {
    type: ActionTypeKeys.IMAGES_SELECTED;
    ids: string[];
}

export interface ImageSelectedAction {
    type: ActionTypeKeys.IMAGE_SELECTED;
    id: string;
}

export interface ImageAnnotationAddedAction {
    type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED;
    annotation: ImageAnnotation;
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

export const selectedImages = (ids: string[]): ImagesSelectedAction => ({
    type: ActionTypeKeys.IMAGES_SELECTED,
    ids
});

export const selectedImage = (id: string): ImageSelectedAction => ({
    type: ActionTypeKeys.IMAGE_SELECTED,
    id
});

export const imageAnnotationAdded = (annotation: ImageAnnotation): ImageAnnotationAddedAction => ({
    type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
    annotation
});

export type ActionType = 
    | FilesUploadedAction
    | ThumbnailBlownUpAction
    | ThumbnailBlownDownAction
    | ImagesSelectedAction
    | ImageSelectedAction
    | ImageAnnotationAddedAction
    | OtherAction;
    
export interface ImageAnnotation {
    imageId: string;
    text: string;
    value: number;
}