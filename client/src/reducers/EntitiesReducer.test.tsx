import { ActionTypeKeys, OtherAction, ImageAnnotationAddedAction, ImageAnnotation } from '../actions/actions';
import { entitiesReducer, EntitiesState, ImageEntity } from './EntitiesReducer';

describe('EntitiesReducer', () => {

    it('should return initial state', () => {
        // given
        let otherAction: OtherAction = {
            type: ActionTypeKeys.OTHER_ACTION
        };

        // when
        let state: EntitiesState = entitiesReducer(undefined, otherAction);

        // then
        expect(state).toEqual({
            images: {
                byId: new Map()
            }
        });
    });

    it('should handle ImageAnnotationAddedAction (add image annotation when image entry exists)', () => {
        // given
        let annotation: ImageAnnotation = {
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        };

        let imageAnnotationAddedAction: ImageAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation
        };

        let imageEntity: ImageEntity = {
            imageId: 'image1',
            annotations: []
        };

        let entitiesState: EntitiesState = {
            images: {
                byId: new Map([[imageEntity.imageId, imageEntity]])
            }
        };

        // when
        let state: EntitiesState = entitiesReducer(entitiesState, imageAnnotationAddedAction);

        // then
        expect(
            state.images.byId.get(imageEntity.imageId).annotations[0]
        ).toEqual({
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        });
    });

    it('should handle ImageAnnotationAddedAction (add image annotation when image entry doesnt exist)', () => {

        // given
        let annotation: ImageAnnotation = {
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        };

        let imageAnnotationAddedAction: ImageAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation
        };

        let entitiesState: EntitiesState = {
            images: {
                byId: new Map()
            }
        };

        // when
        let state: EntitiesState = entitiesReducer(entitiesState, imageAnnotationAddedAction);

        // then
        expect(
            state.images.byId.get(annotation.imageId).annotations[0]
        ).toEqual({
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        });
    });
});