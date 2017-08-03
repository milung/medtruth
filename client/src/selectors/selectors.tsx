
import { State } from '../app/store';

export const getLastFilesUploadID = (state: State): number => {
    return state.files.lastUploadID;
};

export const getBlownUpThumbnailId = (state: State): string => {
    return state.ui.blownUpThumbnailId;
};

export const getSelectedImages = (state: State): Set<string> => {
    return state.ui.selections.images;
};

export const getSelectedSeries = (state: State): Set<string> => {
    return state.ui.selections.series;
};
