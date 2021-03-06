
import { TerminatedUpload } from "../objects";

export enum ActionTypeKeys {
    FILES_UPLOADED = 'FILES_UPLOADED',
    THUMBNAIL_BLOWN_UP = 'THUMBNAIL_BLOWN_UP',
    THUMBNAIL_BLOWN_DOWN = 'THUMBNAIL_BLOWN_DOWN',
    IMAGE_SELECTED = 'IMAGE_SELECTED',
    IMAGES_ALL_UNSELECTED = 'IMAGES_ALL_UNSELECTED',
    SERIES_SELECTED = 'SERIES_SELECTED',
    SERIES_ALL_UNSELECTED = 'SERIES_ALL_UNSELECTED',
    IMAGE_ANNOTATION_ADDED = 'IMAGE_ANNOTATION_ADDED',
    OTHER_ACTION = 'OTHER_ACTION',
    LAST_STUDY_SELECTED = 'LAST_STUDY_SELECTED',
    DOWNLOAD_POPUP_STATE_CHANGE = 'DOWNLOAD_POPUP_STATE_CHANGE',
    DELETE_DIALOG_STATE_CHANGE = 'DELETE_DIALOG_STATE_CHANGE',
    UPLOAD_DIALOG_STATE_CHANGE = 'UPLOAD_DIALOG_STATE_CHANGE', 
    LABELS_DOWNLOADED = 'LABELS_DOWNLOADED',
    REMOVED_ALL = 'REMOVED_ALL',
    REMOVED_SELECTED = 'REMOVED_SELECTED',
    IMAGES_ANNOTATION_REMOVED = 'IMAGES_ANNOTATION_REMOVED',
    IMAGES_ANNOTATION_ADDED = 'IMAGES_ANNOTATION_ADDED',
    IMAGES_ANNOTATIONS_DOWNLOADED = 'IMAGES_ANNOTATIONS_DOWNLOADED',
    PATIENTS_FETCHED = 'PATIENTS_FETCHED',
    ITEM_SELECTED = 'ITEM_SELECTED',
    ALL_ITEMS_UNSELECTED = 'ALL_ITEMS_UNSELECTED',
    TERMINATED_DIALOG_STATE_CHANGE = 'TERMINATED_DIALOG_STATE_CHANGE',
    ADD_TERMINATED_UPLOADS = 'ADD_TERMINATED_UPLOADS',
    CHANGE_UPLOAD_STATUS = 'CHANGE_UPLOAD_STATUS',
    ADD_IMAGES_ANNOTATION_START = 'ADD_IMAGES_ANNOTATION_START'
}

export enum ItemTypes {
    IMAGE,
    SERIES,
    STUDY,
    PATIENT
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

export interface DownloadStatePopup {
    type: ActionTypeKeys.DOWNLOAD_POPUP_STATE_CHANGE;
    showDownloadPopUP: boolean;
}

export interface TerminatedDialogPopup {
    type: ActionTypeKeys.TERMINATED_DIALOG_STATE_CHANGE;
    showTerminatedUploads: boolean;
}

export interface AddTerminatedUploads {
    type: ActionTypeKeys.ADD_TERMINATED_UPLOADS;
    terminatedUploads: TerminatedUpload[];
}

export interface ChangeUploadStatus {
    type: ActionTypeKeys.CHANGE_UPLOAD_STATUS;
    uploading: boolean;
    uploadingText: string;
}

export interface DeleteDialogState {
    type: ActionTypeKeys.DELETE_DIALOG_STATE_CHANGE;
    showDeleteDialog: boolean;
}

export interface UploadDialogState {
    type: ActionTypeKeys.UPLOAD_DIALOG_STATE_CHANGE;
    showUploadDialog: boolean;
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
    imageID: string;
}

export interface SeriesSelectedAction {
    type: ActionTypeKeys.SERIES_SELECTED;
    id: string;
    keyPressed: Keys;
}

// export interface StudiesSelectedAction {
//     type: ActionTypeKeys.STUDIES_SELECTED;
//     id: string;
//     keyPressed: Keys;
// }

export interface SeriesAllUnselectedAction {
    type: ActionTypeKeys.SERIES_ALL_UNSELECTED;
}

export interface OtherAction {
    type: ActionTypeKeys.OTHER_ACTION;
}

export interface LastStudySelected {
    type: ActionTypeKeys.LAST_STUDY_SELECTED;
    lastStudyID: string;
}

export interface LabelsDownloadedAction {
    type: ActionTypeKeys.LABELS_DOWNLOADED;
    labels: string[];
}

export interface RemovedAllAction {
    type: ActionTypeKeys.REMOVED_ALL;
}

export interface RemovedSelectedAction {
    type: ActionTypeKeys.REMOVED_SELECTED;
    itemType: ItemTypes;
    itemIDs: string[];
}

export interface ImagesAnnotationRemovedAction {
    type: ActionTypeKeys.IMAGES_ANNOTATION_REMOVED;
    label: string;
    imageIds: string[];
}

export interface ImagesAnnotationAddedAction {
    type: ActionTypeKeys.IMAGES_ANNOTATION_ADDED;
    imageIds: string[];
    annotation: ImageAnnotation;
}

export interface ImagesAnnotationsDownloadedAction {
    type: ActionTypeKeys.IMAGES_ANNOTATIONS_DOWNLOADED;
    imagesAnnotations: Map<string, ImageAnnotation[]>;
}

export interface PatientsFetchedAction {
    type: ActionTypeKeys.PATIENTS_FETCHED;
    patients: PatientJSON[];
}

export interface ItemSelectedAction {
    type: ActionTypeKeys.ITEM_SELECTED;
    itemType: ItemTypes;
    itemId: string;
    keyPressed: Keys;
}

export interface AllItemsUnselectedAction {
    type: ActionTypeKeys.ALL_ITEMS_UNSELECTED;
}

export interface AddImagesAnnotationStart {
    type: ActionTypeKeys.ADD_IMAGES_ANNOTATION_START;
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

export const imageAnnotationAdded = (annotation: ImageAnnotation, imageID: string): ImageAnnotationAddedAction => ({
    type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
    annotation, imageID
});

export const seriesSelected = (id: string, keyPressed: Keys): SeriesSelectedAction => ({
    type: ActionTypeKeys.SERIES_SELECTED,
    id,
    keyPressed
});

export const seriesAllUnselected = (): SeriesAllUnselectedAction => ({
    type: ActionTypeKeys.SERIES_ALL_UNSELECTED
});

export const downloadPopupStateChange = (state: boolean): DownloadStatePopup => ({
    type: ActionTypeKeys.DOWNLOAD_POPUP_STATE_CHANGE,
    showDownloadPopUP: state
});

export const terminatedPopupStateChange = (state: boolean): TerminatedDialogPopup => ({
    type: ActionTypeKeys.TERMINATED_DIALOG_STATE_CHANGE,
    showTerminatedUploads: state
});

export const addTerminatedUploads = (uploads: TerminatedUpload[]): AddTerminatedUploads => ({
    type: ActionTypeKeys.ADD_TERMINATED_UPLOADS,
    terminatedUploads: uploads
});

export const changeUploadStatus = (uploading: boolean, status: string): ChangeUploadStatus => ({
    type: ActionTypeKeys.CHANGE_UPLOAD_STATUS,
    uploading: uploading,
    uploadingText: status
});


export const deleteDialogStateChange = (state: boolean): DeleteDialogState => ({
    type: ActionTypeKeys.DELETE_DIALOG_STATE_CHANGE,
    showDeleteDialog: state
});

export const uploadDialogStateChange = (state: boolean): UploadDialogState => ({
    type: ActionTypeKeys.UPLOAD_DIALOG_STATE_CHANGE,
    showUploadDialog: state
});

export const labelsDowloadedAction = (labels: string[]): LabelsDownloadedAction => ({
    type: ActionTypeKeys.LABELS_DOWNLOADED,
    labels
});

export const removedAllAction = (): RemovedAllAction => ({
    type: ActionTypeKeys.REMOVED_ALL
});

export const removedSelectedAction = (itemType: ItemTypes, itemIDs: string[]): RemovedSelectedAction => ({
    type: ActionTypeKeys.REMOVED_SELECTED,
    itemType,
    itemIDs
});

export const imagesAnnotationRemovedAction = (imageIds: string[], label: string): ImagesAnnotationRemovedAction => ({
    type: ActionTypeKeys.IMAGES_ANNOTATION_REMOVED,
    imageIds,
    label
});

export const imagesAnnotationAddedAction =
    (imageIds: string[], annotation: ImageAnnotation): ImagesAnnotationAddedAction => ({
        type: ActionTypeKeys.IMAGES_ANNOTATION_ADDED,
        imageIds,
        annotation
    });

export const imagesAnnotationsDownloadedAction =
    (imagesAnnotations: Map<string, ImageAnnotation[]>): ImagesAnnotationsDownloadedAction => ({
        type: ActionTypeKeys.IMAGES_ANNOTATIONS_DOWNLOADED,
        imagesAnnotations
    });

export const patientsFetched = (patients: PatientJSON[]): PatientsFetchedAction => ({
    type: ActionTypeKeys.PATIENTS_FETCHED,
    patients
});

export const itemSelected = (itemType: ItemTypes, itemId: string, keyPressed: Keys): ItemSelectedAction => ({
    type: ActionTypeKeys.ITEM_SELECTED,
    itemType,
    itemId,
    keyPressed
});

export const allItemsUnselected = (): AllItemsUnselectedAction => ({
    type: ActionTypeKeys.ALL_ITEMS_UNSELECTED
});

export const addImagesAnnotationStart = (): AddImagesAnnotationStart => ({
    type: ActionTypeKeys.ADD_IMAGES_ANNOTATION_START
}); 

export type ActionType =
    | FilesUploadedAction
    | ThumbnailBlownUpAction
    | ThumbnailBlownDownAction
    | ImageSelectedAction
    | ImagesAllUnselectedAction
    | SeriesSelectedAction
    | SeriesAllUnselectedAction
    | ImageAnnotationAddedAction
    | OtherAction
    | LastStudySelected
    | DownloadStatePopup
    | DeleteDialogState
    | TerminatedDialogPopup
    | AddTerminatedUploads
    | ChangeUploadStatus
    | UploadDialogState
    | LastStudySelected
    | LabelsDownloadedAction
    | RemovedAllAction
    | RemovedSelectedAction
    | ImagesAnnotationRemovedAction
    | ImagesAnnotationAddedAction
    | ImagesAnnotationsDownloadedAction
    | PatientsFetchedAction
    | ItemSelectedAction
    | AllItemsUnselectedAction
    | AddImagesAnnotationStart;

export interface ImageAnnotation {
    key: string;
    value: number;
}

export interface ImageLabel {
    imageId: string;
    key: string;
    checked: boolean;
}

export class PatientJSON {
    patientID: string;
    patientName: string;
    patientBirthday: number;
    studies: StudyJSON[] = [];
}
export class StudyJSON {
    studyDescription: string;
    studyID: string;
    series: SeriesJSON[] = [];
}
export class SeriesJSON {
    seriesID: string;
    seriesDate: number;
    seriesDescription: string;
    thumbnailImageID: string;
    images: ImageJSON[];
}

export class ImageJSON {
    imageID: string;
    imageNumber: number;
}