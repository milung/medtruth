
import {
    ActionTypeKeys, ActionType, SeriesSelectedAction, Keys, ImageSelectedAction,
    ItemSelectedAction, ItemTypes, AllItemsUnselectedAction, RemovedAllAction, RemovedSelectedAction
} from '../actions/actions';
import { TerminatedUpload } from "../objects";

export interface UIState {
    isBlownUpShowed: boolean;
    blownUpThumbnailId: string;
    selections: {
        images: string[];
        series: string[];
        studies: string[];
        patients: string[]
    };
    lastViewedStudyID: string;
    showDownloadPopUP: boolean;
    showDeleteDialog: boolean;
    showTerminatedUploads: boolean;
    terminatedUploads: TerminatedUpload[];
    uploading: boolean;
    uploadingText: string;
    showUploadDialog: boolean;
}

const initialState: UIState = {
    isBlownUpShowed: false,
    blownUpThumbnailId: '',
    selections: {
        images: [],
        series: [],
        studies: [],
        patients: []
    },
    lastViewedStudyID: '',
    showDownloadPopUP: false,
    showDeleteDialog: false,
    showTerminatedUploads: false,
    terminatedUploads: [],
    uploading: false,
    uploadingText: '',
    showUploadDialog: false
};

export function uiReducer(
    prevState: UIState = initialState,
    action: ActionType): UIState {
    switch (action.type) {
        case ActionTypeKeys.THUMBNAIL_BLOWN_UP:
            return Object.assign(
                {},
                prevState,
                {
                    isBlownUpShowed: true,
                    blownUpThumbnailId: action.thumbnailId
                });
        case ActionTypeKeys.THUMBNAIL_BLOWN_DOWN:
            return Object.assign(
                {},
                prevState,
                {
                    isBlownUpShowed: false,
                    blownUpThumbnailId: ''
                });
        case ActionTypeKeys.IMAGE_SELECTED:
            return handleImageSelecedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ALL_UNSELECTED:
            let newState: UIState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.images = [];
            return newState;
        case ActionTypeKeys.SERIES_SELECTED:
            return handleSeriesSelectedAction(prevState, action);
        case ActionTypeKeys.SERIES_ALL_UNSELECTED:
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = [];
            return newState;
        case ActionTypeKeys.LAST_STUDY_SELECTED:
            console.log('ActionTypeKeys.LAST_STUDY_SELECTED');
            newState = Object.assign({}, prevState);
            newState.lastViewedStudyID = action.lastStudyID;
            return newState;
        case ActionTypeKeys.DOWNLOAD_POPUP_STATE_CHANGE:
            newState = Object.assign({}, prevState);
            newState.showDownloadPopUP = action.showDownloadPopUP;
            return newState;
        case ActionTypeKeys.DELETE_DIALOG_STATE_CHANGE:
            newState = Object.assign({}, prevState);
            newState.showDeleteDialog = action.showDeleteDialog;
            return newState;
        case ActionTypeKeys.TERMINATED_DIALOG_STATE_CHANGE:
            newState = Object.assign({}, prevState);
            newState.showTerminatedUploads = action.showTerminatedUploads;
            return newState;
        case ActionTypeKeys.ADD_TERMINATED_UPLOADS:
            newState = Object.assign({}, prevState);
            newState.terminatedUploads = action.terminatedUploads;
            return newState;
        case ActionTypeKeys.CHANGE_UPLOAD_STATUS:
            newState = Object.assign({}, prevState);
            newState.uploading = action.uploading;
            newState.uploadingText = action.uploadingText;
            return newState;
        case ActionTypeKeys.UPLOAD_DIALOG_STATE_CHANGE:
            newState = Object.assign({}, prevState);
            newState.showUploadDialog = action.showUploadDialog;
            return newState;    
        case ActionTypeKeys.ITEM_SELECTED:
            return handleItemSelectedAction(prevState, action);
        case ActionTypeKeys.ALL_ITEMS_UNSELECTED:
            return handleAllItemsUnselectedAction(prevState, action);
        default:
            return prevState;
    }
}

function handleAllItemsUnselectedAction(prevState: UIState, action: AllItemsUnselectedAction) {
    let newState: UIState = { ...prevState };
    newState.selections = { ...prevState.selections };
    newState.selections.images = [];
    newState.selections.series = [];
    newState.selections.studies = [];
    newState.selections.patients = [];

    return newState;
}

function handleItemSelectedAction(prevState: UIState, action: ItemSelectedAction): UIState {
    let newState: UIState = { ...prevState };
    newState.selections = { ...prevState.selections };

    let oldSelectedItemIds: string[] = [];
    switch (action.itemType) {
        case ItemTypes.IMAGE:
            oldSelectedItemIds = prevState.selections.images;
            break;
        case ItemTypes.SERIES:
            oldSelectedItemIds = prevState.selections.series;
            break;
        case ItemTypes.STUDY:
            oldSelectedItemIds = prevState.selections.studies;
            break;
        case ItemTypes.PATIENT:
            oldSelectedItemIds = prevState.selections.patients;
            break;
        default:
            oldSelectedItemIds = [];
    }

    let index: number = oldSelectedItemIds.indexOf(action.itemId);

    let newSelectedItemIds: string[] = [];

    if (action.keyPressed === Keys.NONE) {
        if (index === -1) {
            newSelectedItemIds.push(action.itemId);
        }
    } else if (action.keyPressed === Keys.CTRL) {
        if (index !== -1) {
            newSelectedItemIds = [...oldSelectedItemIds.slice(0, index),
            ...oldSelectedItemIds.slice(index + 1)];
        } else {
            newSelectedItemIds = [action.itemId, ...oldSelectedItemIds];
        }
    }

    switch (action.itemType) {
        case ItemTypes.IMAGE:
            newState.selections.images = newSelectedItemIds;
            break;
        case ItemTypes.SERIES:
            newState.selections.series = newSelectedItemIds;
            break;
        case ItemTypes.STUDY:
            newState.selections.studies = newSelectedItemIds;
            break;
        case ItemTypes.PATIENT:
            newState.selections.patients = newSelectedItemIds;
            break;
        default:
    }

    return newState;
}

function handleImageSelecedAction(prevState: UIState, action: ImageSelectedAction): UIState {
    let newState: UIState = Object.assign({}, prevState);
    newState.selections = Object.assign({}, prevState.selections);
    let imageIdsArray: string[] = [];
    let index: number = prevState.selections.images.indexOf(action.id);

    if (action.keyPressed === Keys.NONE) {
        if (index === -1) {
            imageIdsArray.push(action.id);
        }
    } else if (action.keyPressed === Keys.CTRL) {
        if (index !== -1) {
            imageIdsArray = [...prevState.selections.images.slice(0, index),
            ...prevState.selections.images.slice(index + 1)];
        } else {
            imageIdsArray = [action.id, ...prevState.selections.images];
        }
    }

    newState.selections.images = imageIdsArray;
    return newState;
}

function handleSeriesSelectedAction(prevState: UIState, action: SeriesSelectedAction): UIState {

    let newState: UIState = Object.assign({}, prevState);
    newState.selections = Object.assign({}, prevState.selections);
    let seriesIdsArray: string[] = [];
    let index: number = prevState.selections.series.indexOf(action.id);

    if (action.keyPressed === Keys.NONE) {
        if (index === -1) {
            seriesIdsArray.push(action.id);
        }
    } else if (action.keyPressed === Keys.CTRL) {
        if (index !== -1) {
            seriesIdsArray = [...prevState.selections.series.slice(0, index),
            ...prevState.selections.series.slice(index + 1)];
        } else {
            seriesIdsArray = [action.id, ...prevState.selections.series];
        }
    }

    newState.selections.series = seriesIdsArray;
    return newState;
}