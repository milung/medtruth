import {
    ActionType, ActionTypeKeys, ImageAnnotation,
    ImageAnnotationAddedAction, UploadDataDownloadedAction, 
    UploadJSON, LabelsDownloadedAction, ImagesAnnotationRemovedAction, 
    ImagesAnnotationAddedAction, ImagesAnnotationsDownloadedAction, ImageJSON
} from '../actions/actions';

export interface EntitiesState {
    images: {
        byId: Map<string, ImageEntity>
    };
    series: {
        byId: Map<string, SeriesEntity>
    };
    labels: string[];
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
    images: ImageJSON[];
}

const initialState: EntitiesState = {
    images: {
        byId: new Map<string, ImageEntity>()
    },
    series: {
        byId: new Map<string, SeriesEntity>()
    },
    labels: []
};

export function entitiesReducer(
    prevState: EntitiesState = initialState,
    action: ActionType): EntitiesState {
    switch (action.type) {
        case ActionTypeKeys.IMAGE_ANNOTATION_ADDED:
            return processImageAnnotationAddedAction(prevState, action);
        case ActionTypeKeys.UPLOAD_DATA_DOWNLOADED:
            return processUploadDataDownloadedAction(prevState, action);
        case ActionTypeKeys.LABELS_DOWNLOADED:
            return processLabelsDownloadedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ANNOTATION_REMOVED:
            return processImagesAnnotationRemovedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ANNOTATION_ADDED:
            return processImagesAnnotationAddedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ANNOTATIONS_DOWNLOADED:
            return processImagesAnnotationsDownloadedAction(prevState, action);
        default:
            return prevState;
    }
}

const processImagesAnnotationsDownloadedAction =
    (prevState: EntitiesState, action: ImagesAnnotationsDownloadedAction): EntitiesState => {

        if (!action.imagesAnnotations.size || action.imagesAnnotations.size === 0) {
            return prevState;
        }

        let newState: EntitiesState = { ...prevState };
        newState.images = { ...prevState.images };
        newState.images.byId = new Map(prevState.images.byId);

        action.imagesAnnotations.forEach(
            (value, key) => {
                let image: ImageEntity = prevState.images.byId.get(key);
                let newImage: ImageEntity;
                let newAnnotationsArray: ImageAnnotation[] = value.map(annotation => ({
                    imageId: key,
                    key: annotation.label,
                    value: annotation.value
                }));

                if (image) {
                    newImage = { ...image };

                } else {
                    newImage = {
                        imageId: key,
                        seriesId: undefined,
                        annotations: []
                    };
                }

                newImage.annotations = newAnnotationsArray;
                newState.images.byId.set(newImage.imageId, newImage);
            }
        );
        return newState;
    };

const processImagesAnnotationAddedAction =
    (prevState: EntitiesState, action: ImagesAnnotationAddedAction) => {
        let modifiedImages: ImageEntity[] = [];
        let counter = 0;
        console.log('annotation ids', action.imageIds);
        action.imageIds.forEach((imageId: string) => {
            let image: ImageEntity = prevState.images.byId.get(imageId);
            console.log('prev state images', prevState.images);
            if (image) {
                let newImage = { ...image };
                let newImageAnnotation = { ...action.annotation };

                let annotationIndex: number = image.annotations.findIndex(annotation =>
                    annotation.key === action.annotation.key
                );

                if (annotationIndex !== -1) {
                    console.log('annotation found');
                    newImage.annotations =
                        [...image.annotations.slice(0, annotationIndex), newImageAnnotation,
                        ...image.annotations.slice(annotationIndex + 1)];
                } else {
                    console.log('annotation not found');
                    newImage.annotations = [...image.annotations, newImageAnnotation];
                }
                console.log('new annotations', newImage.annotations);

                modifiedImages.push(newImage);
                console.log('modified image', newImage);
            } else {
                console.log('image not found');
            }
        });

        let newState: EntitiesState = prevState;

        if (modifiedImages.length > 0) {
            console.log('more modified images');
            newState = { ...prevState };
            newState.images = { ...prevState.images };
            newState.images.byId = new Map(prevState.images.byId);
            modifiedImages.forEach((image) => {
                newState.images.byId.set(image.imageId, image);
            });
        } else {
            console.log('no modified images');
        }

        return newState;
    };

const processImagesAnnotationRemovedAction =
    (prevState: EntitiesState, action: ImagesAnnotationRemovedAction) => {

        let modifiedImages: ImageEntity[] = [];

        action.imageIds.forEach((imageId: string) => {
            let image: ImageEntity = prevState.images.byId.get(imageId);
            if (image) {
                let annotationIndex: number = image.annotations.findIndex(annotation =>
                    annotation.key === action.label
                );

                if (annotationIndex !== -1) {
                    let newImage = { ...image };
                    newImage.annotations =
                        [...image.annotations.slice(0, annotationIndex),
                        ...image.annotations.slice(annotationIndex + 1)];
                    modifiedImages.push(newImage);
                }
            }
        });

        let newState: EntitiesState = prevState;

        if (modifiedImages.length > 0) {
            newState = { ...prevState };
            newState.images = { ...prevState.images };
            newState.images.byId = new Map(prevState.images.byId);
            modifiedImages.forEach((image) => {
                newState.images.byId.set(image.imageId, image);
            });
        }

        return newState;
    };

const processLabelsDownloadedAction =
    (prevState: EntitiesState, action: LabelsDownloadedAction): EntitiesState => {
        let newState: EntitiesState = { ...prevState };
        newState.labels = action.labels;
        return newState;
    };

const processImageAnnotationAddedAction =
    (prevState: EntitiesState, action: ImageAnnotationAddedAction): EntitiesState => {
        let newState = { ...prevState };
        newState.images = { ...prevState.images };
        newState.images.byId = new Map(prevState.images.byId);
        let imageAnnotation: ImageAnnotation = action.annotation;
        let imageEntity: ImageEntity = newState.images.byId.get(action.imageID);
        let newImageEntity: ImageEntity;

        if (imageEntity === undefined) {
            newImageEntity = {
                seriesId: undefined,
                imageId: action.imageID,
                annotations: []
            };
            // if (imageAnnotation.value !== 0) {
            //     newImageEntity.annotations.push(imageAnnotation);
            // }
            newImageEntity.annotations.push(imageAnnotation);

        } else {
            newImageEntity = { ...imageEntity };

            // If the new annotation value is -10, annotation needs to be deleted from the old state
            if (imageAnnotation.value === -10) {
                newImageEntity.annotations = [];
                for (var annotation of imageEntity.annotations) {
                    // Push all other annotations into the new state
                    if (annotation.key !== imageAnnotation.key) {
                        newImageEntity.annotations.push(annotation);
                    }
                }
            } else {
                newImageEntity.annotations = [...imageEntity.annotations];
                var annotationExists = false;
                for (var annotation of newImageEntity.annotations) {
                    // Check if annotation already IS assigned to the image
                    // If yes, just change the value of the annotation
                    if (annotation.key === imageAnnotation.key) {
                        annotation.value = imageAnnotation.value;
                        annotationExists = true;
                        break;
                    }
                }
                // If not, add new image annotation
                // if (!annotationExists && imageAnnotation.value !== 0) {
                if (!annotationExists) {
                    newImageEntity.annotations.push(imageAnnotation);
                }
            }
        }
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
                for (let image of series.images) {
                    newState.images.byId.set(
                        image.imageID,
                        { imageId: image.imageID, annotations: [], seriesId: series.seriesID }
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