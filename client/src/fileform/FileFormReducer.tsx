
import { FileFormAction, FILE_CHANGED } from './FileFormActions';

export interface FileFormState {
    file: {
        data: any,
        valid: boolean
    };
}

const initialState: FileFormState = {
    file: {
        data: null as any,
        valid: null as boolean
    }
};

export function FileFormReducer(
    prevState: FileFormState = initialState,
    action: FileFormAction): FileFormState {
    switch (action.type) {
        case FILE_CHANGED:
            return Object.assign(
                {}, 
                prevState, 
                prevState.file = {...prevState.file, valid: action.valid});
        default:
            return prevState;
    }
}
