
import { ActionTypeKeys, ActionType } from '../actions/actions';

export interface UIState {
    isBlownUpShowed: boolean;
    blownUpThumbnailId: string;
    selections: {
        images: Set<string>;
        series: Set<string>;
    };
}

const initialState: UIState = {
    isBlownUpShowed: false,
    blownUpThumbnailId: '',
    selections: {
        images: new Set<string>(),
        series: new Set<string>()
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
            let imageIdsSet: Set<string> = addRemoveFromSet(
                prevState.selections.images,
                action.id
            );
            let newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.images = imageIdsSet;
            return newState;
        case ActionTypeKeys.SERIES_SELECTED:
            let seriesIdsSet: Set<string> = addRemoveFromSet(
                prevState.selections.series,
                action.id
            );
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = seriesIdsSet;
            return newState;
        case ActionTypeKeys.SERIES_ALL_UNSELECTED:
            newState = Object.assign({}, prevState);
            newState.selections = Object.assign({}, prevState.selections);
            newState.selections.series = new Set<string>();
            return newState;
        // case ActionTypeKeys.IMAGES_SELECTED:
        //     imageIdsSet = addRemoveSetFromSet(
        //         prevState.selections.images,
        //         new Set(action.ids)
        //     );
        //     newState = Object.assign({}, prevState);
        //     newState.selections = Object.assign({}, prevState.selections);
        //     newState.selections.images = imageIdsSet;
        //     return newState;
        default:
            return prevState;
    }
}

function addRemoveFromSet(selectedBefore: Set<string>, selected: string): Set<string> {
    let set: Set<string> = new Set(selectedBefore);
    if (selectedBefore.has(selected)) {
        set.delete(selected);
    } else {
        set.add(selected);
    }
    return set;
}
