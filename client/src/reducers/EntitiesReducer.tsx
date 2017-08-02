import { ActionType, ActionTypeKeys, ImageAnnotation } from '../actions/actions';

export interface EntitiesState {
    images: {
        byId: Map<string, ImageEntity>
    };
    /*series: {
        byId: Map<string, SeriesEntity>
    };*/
}

export interface ImageEntity {
    imageId: string;
    annotations: ImageAnnotation[];
}

/*export interface SeriesEntity {
    seriesId: string;
    images: string[];
}*/

const initialState: EntitiesState = {
    images: {
        byId: new Map<string, ImageEntity>()
    }/*,
    series: {
        byId: new Map<string, SeriesEntity>()
    }*/
};

export function entitiesReducer(
    prevState: EntitiesState = initialState,
    action: ActionType): EntitiesState {
    switch (action.type) {
        case ActionTypeKeys.IMAGE_ANNOTATION_ADDED:
            let newState = { ...prevState };
            newState.images = { ...prevState.images };
            newState.images.byId = new Map(prevState.images.byId);
            let imageAnnotation: ImageAnnotation = action.annotation;
            let imageEntity: ImageEntity = newState.images.byId.get(imageAnnotation.imageId);
            let newImageEntity: ImageEntity;
            if (imageEntity === undefined) {
                newImageEntity = {
                    imageId: imageAnnotation.imageId,
                    annotations: []
                };
            } else {
                newImageEntity = { ...imageEntity };
                newImageEntity.annotations = [...imageEntity.annotations];
            }
            newImageEntity.annotations.push(imageAnnotation);
            newState.images.byId.set(newImageEntity.imageId, newImageEntity);
            return newState;
        default:
            return prevState;
    }
}