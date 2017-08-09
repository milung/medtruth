
export enum ActionTypeKeys {
    FILES_UPLOADED = 'FILES_UPLOADED',
    THUMBNAIL_BLOWN_UP = 'THUMBNAIL_BLOWN_UP',
    THUMBNAIL_BLOWN_DOWN = 'THUMBNAIL_BLOWN_DOWN',
    // IMAGES_SELECTED = 'IMAGES_SELECTED',
    IMAGE_SELECTED = 'IMAGE_SELECTED',
    SERIES_SELECTED = 'SERIES_SELECTED',
    SERIES_ALL_UNSELECTED = 'SERIES_ALL_UNSELECTED',
    IMAGE_ANNOTATION_ADDED = 'IMAGE_ANNOTATION_ADDED',
    UPLOAD_DATA_DOWNLOADED = 'UPLOAD_DATA_DOWNLOADED',
    // IMAGE_ANNOTATION_SELECTED = 'IMAGE_ANNOTATION_SELECTED',
    OTHER_ACTION = 'OTHER_ACTION'
}

export enum Keys {
    NONE,
    CTRL,
    SHIFT
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

// export interface ImagesSelectedAction {
//     type: ActionTypeKeys.IMAGES_SELECTED;
//     ids: string[];
// }

export interface ImageSelectedAction {
    type: ActionTypeKeys.IMAGE_SELECTED;
    id: string;
}

export interface ImageAnnotationAddedAction {
    type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED;
    annotation: ImageAnnotation;
}

export interface SeriesSelectedAction {
    type: ActionTypeKeys.SERIES_SELECTED;
    keyPressed: Keys;
    id: string;
}

export interface SeriesAllUnselectedAction {
    type: ActionTypeKeys.SERIES_ALL_UNSELECTED;
}

export interface UploadDataDownloadedAction {
    type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED;
    upload: UploadJSON; 
}

// export interface ImageAnnotationSelected {
//     type: ActionTypeKeys.LABEL_SELECTED;

// }

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

// export const selectedImages = (ids: string[]): ImagesSelectedAction => ({
//     type: ActionTypeKeys.IMAGES_SELECTED,
//     ids
// });

export const selectedImage = (id: string): ImageSelectedAction => ({
    type: ActionTypeKeys.IMAGE_SELECTED,
    id
});

export const imageAnnotationAdded = (annotation: ImageAnnotation): ImageAnnotationAddedAction => ({
    type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
    annotation
});

export const seriesSelected = (id: string, keyPressed: Keys): SeriesSelectedAction => ({
    type: ActionTypeKeys.SERIES_SELECTED,
    id,
    keyPressed
});

export const seriesAllUnselected = (): SeriesAllUnselectedAction => ({
    type: ActionTypeKeys.SERIES_ALL_UNSELECTED
});

export const uploadDataDowloaded = (upload: UploadJSON): UploadDataDownloadedAction => ({
    type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED,
    upload
});

export type ActionType = 
    | FilesUploadedAction
    | ThumbnailBlownUpAction
    | ThumbnailBlownDownAction
    // | ImagesSelectedAction
    | ImageSelectedAction
    | SeriesSelectedAction
    | SeriesAllUnselectedAction
    | ImageAnnotationAddedAction
    | UploadDataDownloadedAction
    // | LabelSelected
    | OtherAction;
    
export interface ImageAnnotation {
    imageId: string;
    key: string;
    value: number;
}

export interface ImageLabel {
    imageId: string;
    key: string;
    checked: boolean;
}

export interface UploadJSON {
    uploadID: number;
    uploadDate: Date;
    studies: StudyJSON[];
}

export interface StudyJSON {
    patientName: string;
    patientBirthday: number;
    studyDescription: string;
    studyID: string;
    series: SeriesJSON[];
}

export interface SeriesJSON {
    seriesID: string;
    seriesDate: number;
    seriesDescription: string;
    thumbnailImageID: string;
    images: string[];
}