import { uiReducer, UIState } from './UIReducer';
import { OtherAction, ActionTypeKeys, ImageSelectedAction, SeriesSelectedAction } from '../actions/actions';

describe('UIReducer', () => {
    let otherAction: OtherAction = {
        type: ActionTypeKeys.OTHER_ACTION
    };

    it('should return initial state', () => {
        expect(uiReducer(undefined, otherAction)).toEqual({
            blownUpThumbnailId: '',
            selections: {
                images: new Set<string>(),
                series: new Set<string>()
            }
        });
    });

    it('should handle ImageSelectedAction (select image)', () => {
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'aaaaa'
        };

        expect(uiReducer(undefined, imageSelectedAction).selections.images.has('aaaaa')).toBeTruthy();
    });

    it('should handle ImageSelectedAction (deselect image)', () => {
        let imageSelectedAction: ImageSelectedAction = {
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: 'aaaaa'
        };

        let uiState: UIState = {
            blownUpThumbnailId: '',
            selections: {
                images: new Set<string>(['aaaaa']),
                series: new Set<string>()
            }
        };

        expect(uiReducer(uiState, imageSelectedAction).selections.images.size).toBe(0);
    });

    it('should handle SeriesSelectedAction (select series)', () => {
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        expect(uiReducer(undefined, seriesSelectedAction).selections.series.has('abcd1234')).toBeTruthy();
    });

    it('should handle SeriesSelectedAction (deselect series)', () => {
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        let uiState: UIState = {
            blownUpThumbnailId: '',
            selections: {
                images: new Set<string>(),
                series: new Set<string>(['abcd1234'])
            }
        };

        expect(uiReducer(uiState, seriesSelectedAction).selections.series.size).toBe(0);
    });

    it('SeriesSelectedAction should not change selected images set', () => {
        let seriesSelectedAction: SeriesSelectedAction = {
            type: ActionTypeKeys.SERIES_SELECTED,
            id: 'abcd1234'
        };

        let uiState: UIState = {
            blownUpThumbnailId: '',
            selections: {
                images: new Set<string>(['aaaaa']),
                series: new Set<string>(['abcd1234'])
            }
        };

        expect(uiReducer(uiState, seriesSelectedAction).selections.images.has('aaaaa')).toBeTruthy();
    });

});