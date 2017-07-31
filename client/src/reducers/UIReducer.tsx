import { ActionType, ActionTypeKeys } from '../actions/actions';

export interface UIState {
    blownUpThumbnailId: string;
}

const initialState: UIState = {
    blownUpThumbnailId: ''
};

export function uiReducer(
    prevState: UIState = initialState,
    action: ActionType): UIState {
    switch (action.type) {
        case ActionTypeKeys.THUMBNAIL_BLOWN_UP:
            return Object.assign(
                {},
                prevState,
                { blownUpThumbnailId: action.thumbnailId });
        case ActionTypeKeys.THUMBNAIL_BLOWN_DOWN:
            return Object.assign(
                {},
                prevState,
                { blownUpThumbnailId: '' });
        default:
            return prevState;
    }
}
