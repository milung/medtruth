import {
    ActionType, ActionTypeKeys, ImageAnnotation,
    ImageAnnotationAddedAction, UploadDataDownloadedAction, UploadJSON
} from '../actions/actions';

export interface EntitiesState {
    images: {
        byId: Map<string, ImageEntity>
    };
    series: {
        byId: Map<string, SeriesEntity>
    };
}

export interface ImageEntity {
    seriesId: string;
    imageId: string;
    annotations: ImageAnnotation[];
}

export interface SeriesEntity {
    seriesId: string;
    seriesDate: number;
    seriesDescription: string;
    thumbnailImageID: string;
    images: string[];
}

const initialState: EntitiesState = {
    images: {
        byId: new Map<string, ImageEntity>()
    },
    series: {
        byId: new Map<string, SeriesEntity>()
    }
};

export function entitiesReducer(
    prevState: EntitiesState = initialState,
    action: ActionType): EntitiesState {
    switch (action.type) {
        case ActionTypeKeys.IMAGE_ANNOTATION_ADDED:
            return processImageAnnotationAddedAction(prevState, action);
        case ActionTypeKeys.UPLOAD_DATA_DOWNLOADED:
            return processUploadDataDownloadedAction(prevState, action);
        default:
            return prevState;
    }
}

const processImageAnnotationAddedAction =
    (prevState: EntitiesState, action: ImageAnnotationAddedAction): EntitiesState => {
        let newState = { ...prevState };
        newState.images = { ...prevState.images };
        newState.images.byId = new Map(prevState.images.byId);
        let imageAnnotation: ImageAnnotation = action.annotation;
        let imageEntity: ImageEntity = newState.images.byId.get(imageAnnotation.imageId);
        let newImageEntity: ImageEntity;
        if (imageEntity === undefined) {
            newImageEntity = {
                seriesId: undefined,
                imageId: imageAnnotation.imageId,
                annotations: []
            };
        } else {
            newImageEntity = { ...imageEntity };

            var newValue;
            console.log('image entity annotations' + imageEntity.annotations);
            /*
            for (var annotation of imageEntity.annotations) {
                // Check if annotation already IS assigned to the image
                (annotation.key === action.annotation.key) ? newValue = action.annotation.value : newValue = annotation.value;
                //console.log(annotation.imageId + ' ' + annotation.key + ' ' + newValue);
                newImageEntity.annotations.push({
                    imageId: annotation.imageId,
                    key: annotation.key,
                    value: newValue
                });
            }
            */

            //newImageEntity.annotations = [...imageEntity.annotations];

            var newAnnotation = imageAnnotation;
            for (var annotation of newImageEntity.annotations) {
                // Check if annotation already IS assigned to the image
                if (annotation.key === action.annotation.key) {
                    console.log(annotation.key + "FOUND THE SAME ANNOTATION!");
                    newAnnotation = annotation;
                    newAnnotation.value = action.annotation.value;
                    newImageEntity.annotations.push(newAnnotation);
                    console.log("pushed annotation " + newAnnotation.key + " " + newAnnotation.value);
                    break;
                    //console.log(annotation.imageId + ' ' + annotation.key + ' ' + newValue);
                    //annotation.value = action.annotation.value;
                } else {
                     newImageEntity.annotations.push(annotation);
                     console.log("pushed annotation " + annotation.key + " " + annotation.value);
                }
            }

            console.log('NEW new image entity annotations' + newImageEntity.annotations);
        }
        //newImageEntity.annotations.push(imageAnnotation);
        newState.images.byId.set(newImageEntity.imageId, newImageEntity);
        return newState;
    };

const processUploadDataDownloadedAction =
    (prevState: EntitiesState, action: UploadDataDownloadedAction): EntitiesState => {
        let newState = { ...prevState };
        newState.images = { ...prevState.images };
        newState.images.byId = new Map<string, ImageEntity>();
        newState.series = { ...prevState.series };
        newState.series.byId = new Map<string, SeriesEntity>();
        let upload: UploadJSON = action.upload;
        for (let study of upload.studies) {
            for (let series of study.series) {
                for (let imageId of series.images) {
                    newState.images.byId.set(
                        imageId,
                        { imageId, annotations: [], seriesId: series.seriesID }
                    );
                }
                newState.series.byId.set(
                    series.seriesID,
                    {
                        seriesId: series.seriesID,
                        images: series.images,
                        seriesDate: series.seriesDate,
                        seriesDescription: series.seriesDescription,
                        thumbnailImageID: series.thumbnailImageID
                    }
                );
            }
        }
        return newState;
    };