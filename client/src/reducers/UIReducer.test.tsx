import { uiReducer, UIState } from './UIReducer';
import { OtherAction, ActionTypeKeys, ImageSelectedAction, SeriesSelectedAction } from '../actions/actions';

describe('UIReducer', () => {
    let otherAction: OtherAction = {
        type: ActionTypeKeys.OTHER_ACTION
    };

    it('should return initial state', () => {
        expect(uiReducer(undefined, otherAction)).toEqual({
            blownUpThumbnailId: '',
            isBlownUpShowed: false,
            selections: {
                images: [],
                series: []
            }
        });
    });

    it('should handle ImageSelectedAction (select image)', () => {
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'aaaaa'
        };

        expect(uiReducer(undefined, imageSelectedAction).selections.images.indexOf('aaaaa') !== -1).toBeTruthy();
    });

    it('should handle ImageSelectedAction (deselect image)', () => {
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'aaaaa'
        };

        let uiState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['aaaaa'],
                series: []
            }
        };

        expect(uiReducer(uiState, imageSelectedAction).selections.images.length).toBe(0);
    });

    it('should handle SeriesSelectedAction (select series)', () => {
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        expect(uiReducer(undefined, seriesSelectedAction).selections.series.indexOf('abcd1234') !== -1).toBeTruthy();
    });

    it('should handle SeriesSelectedAction (deselect series)', () => {
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        let uiState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: [],
                series: ['abcd1234']
            }
        };

        expect(uiReducer(uiState, seriesSelectedAction).selections.series.length).toBe(0);
    });

    it('SeriesSelectedAction should not change selected images set', () => {
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        let uiState: UIState = {
            isBlownUpShowed: false,
            blownUpThumbnailId: '',
            selections: {
                images: ['aaaaa'],
                series: ['abcd1234']
            }
        };

        expect(uiReducer(uiState, seriesSelectedAction).selections.images.indexOf('aaaaa') !== -1).toBeTruthy();
    });

});