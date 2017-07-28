
import { ActionTypeKeys, ActionType } from '../actions/actions';

export interface ImagesState {
    isDisplayedLastUpload: boolean;
}

const initialState: ImagesState = {
    isDisplayedLastUpload: false
};

export function imagesReducer(
    prevState: ImagesState = initialState,
    action: ActionType): ImagesState {
    switch (action.type) {
        case ActionTypeKeys.FILES_UPLOADED:
            return Object.assign(
                {},
                prevState,
                { isDisplayedLastUpload: false });
        default:
            return prevState;
    }
}
