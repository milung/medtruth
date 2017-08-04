
import { filesReducer, FilesState } from './FilesReducer';
import { ActionTypeKeys, OtherAction, FilesUploadedAction } from '../actions/actions';

describe('filesReducer', () => {

    it('should return initial state', () => {

        // given
        let otherAction: OtherAction = {
            type: ActionTypeKeys.OTHER_ACTION
        };

        let prevState: FilesState = undefined;

        // when
        let newState: FilesState = filesReducer(prevState, otherAction);

        // then
        expect(newState).toEqual({
            lastUploadID: -1
        });
    });

    it('should handle FilesUploadedAction', () => {

        // given
        let filesUploadedAction: FilesUploadedAction = {
            type: ActionTypeKeys.FILES_UPLOADED,
            uploadID: 123321
        };

        let prevState: FilesState = undefined;

        // when
        let newState: FilesState = filesReducer(prevState, filesUploadedAction);

        // then
        expect(newState.lastUploadID).toBe(123321);
    });
});