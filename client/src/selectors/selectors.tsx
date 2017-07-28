
import { State } from '../app/store';

export const getLastFilesUploadID = (state: State): number => {
    return state.files.lastUploadID;
};