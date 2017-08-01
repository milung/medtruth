import { ActionType, ActionTypeKeys, ImageAnnotation } from '../actions/actions';

export interface EntitiesState {
    images: Map<string, ImageEntity>;
}

export interface ImageEntity {
    imageId: string;
    annotations: ImageAnnotation[];
}

const initialState: EntitiesState = {
    images: new Map()
};

export function entitiesReducer(
    prevState: EntitiesState = initialState,
    action: ActionType): EntitiesState {
    switch (action.type) {
        case ActionTypeKeys.IMAGE_ANNOTATION_ADDED:
            let newState = { ...prevState };
            newState.images = new Map(prevState.images);
            let imageAnnotation: ImageAnnotation = action.annotation;
            let imageEntity: ImageEntity = newState.images.get(imageAnnotation.imageId);
            let newImageEntity: ImageEntity;
            if (imageEntity === undefined) {
                newImageEntity = {
                    imageId: imageAnnotation.imageId,
                    annotations: []
                };
            } else {
                newImageEntity = {...imageEntity};
                newImageEntity.annotations = [...imageEntity.annotations];
            }
            newImageEntity.annotations.push(imageAnnotation);
            newState.images.set(newImageEntity.imageId, newImageEntity);
            return newState;
        default:
            return prevState;
    }
}