import { uiReducer, UIState } from './UIReducer';
import { OtherAction, ActionTypeKeys, ImageSelectedAction, 
    SeriesSelectedAction, UploadDataDownloadedAction, Keys, ImagesAllUnselectedAction
} from '../actions/actions';

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

    it('should handle simple ImageSelectedAction (select image)', () => {

        // given
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'abcd5678',
            keyPressed: Keys.NONE
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['abcd1234'],
                series: []
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, imageSelectedAction);

        // then
        expect(newState.selections.images.indexOf('abcd1234') === -1).toBeTruthy();
        expect(newState.selections.images.indexOf('abcd5678') !== -1).toBeTruthy();
    });

    it('should handle simple ImageSelectedAction (deselect image)', () => {

        // given
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'abcd1234',
            keyPressed: Keys.NONE
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['abcd1234'],
                series: []
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, imageSelectedAction);

        // then
        expect(newState.selections.images.indexOf('abcd1234') === -1).toBeTruthy();
    });

    it('should handle CTRL ImageSelectedAction (select image)', () => {

        // given
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'abcd5678',
            keyPressed: Keys.CTRL
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['abcd1234'],
                series: []
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, imageSelectedAction);

        // then
        expect(newState.selections.images.indexOf('abcd1234') !== -1).toBeTruthy();
        expect(newState.selections.images.indexOf('abcd5678') !== -1).toBeTruthy();
    });

    it('should handle CTRL ImageSelectedAction (deselect image)', () => {

        // given
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'abcd5678',
            keyPressed: Keys.CTRL
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['abcd1234', 'abcd5678'],
                series: []
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false

        };

        // when
        let newState: UIState = uiReducer(prevState, imageSelectedAction);

        // then
        expect(newState.selections.images.indexOf('abcd1234') !== -1).toBeTruthy();
        expect(newState.selections.images.indexOf('abcd5678') === -1).toBeTruthy();
    });

    it('should handle ImagesAllUnselectedAction', () => {

        // given
        let imagesAllUnselectedAction: ImagesAllUnselectedAction = {
            type: ActionTypeKeys.IMAGES_ALL_UNSELECTED
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['abcd1234', 'abcd5678'],
                series: []
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, imagesAllUnselectedAction);

        // then
        expect(newState.selections.images.length).toBe(0);
    });

    it('should handle simple SeriesSelectedAction (select series)', () => {

        // given
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd5678',
            keyPressed: Keys.NONE
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: [],
                series: ['abcd1234']
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, seriesSelectedAction);

        // then
        expect(newState.selections.series.indexOf('abcd1234') === -1).toBeTruthy();
        expect(newState.selections.series.indexOf('abcd5678') !== -1).toBeTruthy();
    });

    it('should handle simple SeriesSelectedAction (deselect series)', () => {

        // given
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234',
            keyPressed: Keys.NONE
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: [],
                series: ['abcd1234']
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, seriesSelectedAction);

        // then
        expect(newState.selections.series.indexOf('abcd1234') === -1).toBeTruthy();
    });

    it('should handle CTRL SeriesSelectedAction (select series)', () => {

        // given
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd5678',
            keyPressed: Keys.CTRL
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: [],
                series: ['abcd1234']
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, seriesSelectedAction);

        // then
        expect(newState.selections.series.indexOf('abcd1234') !== -1).toBeTruthy();
        expect(newState.selections.series.indexOf('abcd5678') !== -1).toBeTruthy();
    });

    it('should handle CTRL SeriesSelectedAction (deselect series)', () => {

        // given
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd5678',
            keyPressed: Keys.CTRL
        };

        let prevState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: [],
                series: ['abcd1234', 'abcd5678']
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, seriesSelectedAction);

        // then
        expect(newState.selections.series.indexOf('abcd1234') !== -1).toBeTruthy();
        expect(newState.selections.series.indexOf('abcd5678') === -1).toBeTruthy();
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
            },
            lastViewedStudyID: '',
            showDownloadPopUP: false
        };

        // when
        let newState: UIState = uiReducer(prevState, uploadDataDownloadedAction);

        // then
        expect(newState.selections.series.length).toBe(0);
        expect(newState.selections.images.length).toBe(0);
    });
});