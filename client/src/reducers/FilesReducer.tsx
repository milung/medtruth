import { ActionType, ActionTypeKeys } from '../actions/actions';

export interface FilesState {
    lastUploadID: number;
}

const initialState: FilesState = {
    lastUploadID: 0
};

export function filesReducer(
    prevState: FilesState = initialState,
    action: ActionType): FilesState {
    switch (action.type) {
        case ActionTypeKeys.FILES_UPLOADED:
            return Object.assign(
                {}, 
                prevState, 
                {lastUploadID: action.uploadID});
        default:
            return prevState;
    }
}
