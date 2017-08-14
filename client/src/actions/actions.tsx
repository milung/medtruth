
export enum ActionTypeKeys {
    FILES_UPLOADED = 'FILES_UPLOADED',
    THUMBNAIL_BLOWN_UP = 'THUMBNAIL_BLOWN_UP',
    THUMBNAIL_BLOWN_DOWN = 'THUMBNAIL_BLOWN_DOWN',
    // IMAGES_SELECTED = 'IMAGES_SELECTED',
    IMAGE_SELECTED = 'IMAGE_SELECTED',
    IMAGES_ALL_UNSELECTED = 'IMAGES_ALL_UNSELECTED',
    SERIES_SELECTED = 'SERIES_SELECTED',
    SERIES_ALL_UNSELECTED = 'SERIES_ALL_UNSELECTED',
    IMAGE_ANNOTATION_ADDED = 'IMAGE_ANNOTATION_ADDED',
    UPLOAD_DATA_DOWNLOADED = 'UPLOAD_DATA_DOWNLOADED',
    // IMAGE_ANNOTATION_SELECTED = 'IMAGE_ANNOTATION_SELECTED',
    OTHER_ACTION = 'OTHER_ACTION',
    LAST_STUDY_SELECTED = 'LAST_STUDY_SELECTED'
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
    keyPressed: Keys;
}

export interface ImagesAllUnselectedAction {
    type: ActionTypeKeys.IMAGES_ALL_UNSELECTED;
}
export interface ImageAnnotationAddedAction {
    type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED;
    annotation: ImageAnnotation;
}

export interface SeriesSelectedAction {
    type: ActionTypeKeys.SERIES_SELECTED;
    id: string;
    keyPressed: Keys;
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

export interface LastStudySelected {
    type: ActionTypeKeys.LAST_STUDY_SELECTED;
    lastStudyID: string;
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

export const lastStudySelected = (studyID: string): LastStudySelected => ({
    type: ActionTypeKeys.LAST_STUDY_SELECTED,
    lastStudyID: studyID
});

// export const selectedImages = (ids: string[]): ImagesSelectedAction => ({
//     type: ActionTypeKeys.IMAGES_SELECTED,
//     ids
// });

export const selectedImage = (id: string, keyPressed: Keys): ImageSelectedAction => ({
    type: ActionTypeKeys.IMAGE_SELECTED,
    id,
    keyPressed
});

export const imagesAllUnselected = (): ImagesAllUnselectedAction => ({
    type: ActionTypeKeys.IMAGES_ALL_UNSELECTED,
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
    | ImagesAllUnselectedAction
    | SeriesSelectedAction
    | SeriesAllUnselectedAction
    | ImageAnnotationAddedAction
    | UploadDataDownloadedAction
    // | LabelSelected
    | OtherAction
    | LastStudySelected;

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