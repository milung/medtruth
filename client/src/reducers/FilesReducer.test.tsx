
import { filesReducer } from './FilesReducer';
import { ActionTypeKeys, OtherAction, FilesUploadedAction } from '../actions/actions';

describe('filesReducer', () => {
    let otherAction: OtherAction = {
        type: ActionTypeKeys.OTHER_ACTION
    };

    it('should return initial state', () => {
        expect(filesReducer(undefined, otherAction)).toEqual({
            lastUploadID: -1
        });
    });

    it('should handle FilesUploadedAction', () => {
        let filesUploadedAction: FilesUploadedAction = {
            type: ActionTypeKeys.FILES_UPLOADED,
            uploadID: 123321
        };

        expect(filesReducer(undefined, filesUploadedAction).lastUploadID).toBe(123321);
    });
});