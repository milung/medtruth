import { uiReducer, UIState } from './UIReducer';
import { OtherAction, ActionTypeKeys, ImageSelectedAction, SeriesSelectedAction, UploadDataDownloadedAction } from '../actions/actions';

describe('UIReducer', () => {

    it('should return initial state', () => {
        // given
        let otherAction: OtherAction = {
            type: ActionTypeKeys.OTHER_ACTION
        };

        let prevState: UIState = undefined;

        // when
        let newState: UIState = uiReducer(prevState, otherAction);

        // then
        expect(newState).toEqual({
            blownUpThumbnailId: '',
            isBlownUpShowed: false,
            selections: {
                images: [],
                series: []
            }
        });
    });

    it('should handle ImageSelectedAction (select image)', () => {
        // given
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'aaaaa'
        };

        let prevState: UIState = undefined;

        // when
        let newState: UIState = uiReducer(prevState, imageSelectedAction);

        // then
        expect(newState.selections.images.indexOf('aaaaa') !== -1).toBeTruthy();
    });

    it('should handle ImageSelectedAction (deselect image)', () => {

        // given
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'aaaaa'
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['aaaaa', 'bbbbb'],
                series: []
            }
        };

        // when
        let newState: UIState = uiReducer(prevState, imageSelectedAction);

        // then
        expect(newState.selections.images.indexOf('aaaaa') === -1).toBeTruthy();
    });

    it('should handle SeriesSelectedAction (select series)', () => {

        // given
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        // when
        let newState: UIState = uiReducer(undefined, seriesSelectedAction);

        // then
        expect(newState.selections.series.indexOf('abcd1234') !== -1).toBeTruthy();
    });

    it('should handle SeriesSelectedAction (deselect series)', () => {

        // given
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: [],
                series: ['1234abcd', 'abcd1234']
            }
        };

        // when
        let newState: UIState = uiReducer(prevState, seriesSelectedAction);

        // then
        expect(newState.selections.series.indexOf('abcd1234') === -1).toBeTruthy();
    });

    it('should handle UploadDataDownloadedAction (deselect all series and images)', () => {

        // given
        let uploadDataDownloadedAction: UploadDataDownloadedAction = {
            type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED,
            upload: undefined
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['1234', '4321'],
                series: ['1234abcd', 'abcd1234']
            }
        };

        // when
        let newState: UIState = uiReducer(prevState, uploadDataDownloadedAction);

        // then
        expect(newState.selections.series.length).toBe(0);
        expect(newState.selections.images.length).toBe(0);
    });
});