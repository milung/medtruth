
import { ActionTypeKeys, ActionType, SeriesSelectedAction, Keys, ImageSelectedAction } from '../actions/actions';

export interface UIState {
    isBlownUpShowed: boolean;
    blownUpThumbnailId: string;
    selections: {
        images: string[];
        series: string[]
    };
    lastViewedStudyID: string;
}

const initialState: UIState = {
    isBlownUpShowed: false,
    blownUpThumbnailId: '',
    selections: {
        images: [],
        series: []
    },
    lastViewedStudyID: ''
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
        case ActionTypeKeys.UPLOAD_DATA_DOWNLOADED:
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = [];
            newState.selections.images = [];
            return newState;
        case ActionTypeKeys.LAST_STUDY_SELECTED:
            console.log('ActionTypeKeys.LAST_STUDY_SELECTED');

            newState = Object.assign({}, prevState);
            newState.lastViewedStudyID = action.lastStudyID;
            return newState;
        default:
            return prevState;
    }
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
