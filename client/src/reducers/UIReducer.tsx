
import { ActionTypeKeys, ActionType } from '../actions/actions';

export interface UIState {
    isBlownUpShowed: boolean;
    blownUpThumbnailId: string;
    selections: {
        images: string[];
        series: string[]
    };
}

const initialState: UIState = {
    isBlownUpShowed: false,
    blownUpThumbnailId: '',
    selections: {
        images: [],
        series: []
    }
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
            let imageIdsArray: string[] = addRemoveFromArray(
                prevState.selections.images,
                action.id
            );
            let newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.images = imageIdsArray;
            return newState;
        case ActionTypeKeys.SERIES_SELECTED:
            let seriesIdsArray: string[] = addRemoveFromArray(
                prevState.selections.series,
                action.id
            );
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = seriesIdsArray;
            return newState;
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
        default:
            return prevState;
    }
}

function addRemoveFromArray(selectedBefore: string[], selected: string): string[] {
    let array: string[];
    let index: number = selectedBefore.indexOf(selected);
    if (index !== -1) {
        array = [...selectedBefore.slice(0, index), ...selectedBefore.slice(index + 1)];
    } else {
        array = [selected, ...selectedBefore];
    }
    return array;
}
