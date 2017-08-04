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
            newImageEntity.annotations = [...imageEntity.annotations];
        }
        newImageEntity.annotations.push(imageAnnotation);
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