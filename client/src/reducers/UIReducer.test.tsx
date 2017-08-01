import { uiReducer, UIState } from './UIReducer';
import { OtherAction, ActionTypeKeys, ImageSelectedAction } from '../actions/actions';

describe('UIReducer', () => {
    let otherAction: OtherAction = {
        type: ActionTypeKeys.OTHER_ACTION
    };

    it('should return initial state', () => {
        expect(uiReducer(undefined, otherAction)).toEqual({
            blownUpThumbnailId: '',
            selections: {
                images: new Set<string>(),
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
            }
        };

        expect(uiReducer(uiState, imageSelectedAction).selections.images.size).toBe(0);
    });

});