import {
    ActionType, ActionTypeKeys, ImageAnnotation,
    ImageAnnotationAddedAction, PatientJSON, LabelsDownloadedAction, ImagesAnnotationRemovedAction,
    ImagesAnnotationAddedAction, ImagesAnnotationsDownloadedAction, PatientsFetchedAction, ImageJSON
} from '../actions/actions';

import { normalize, schema } from 'normalizr';

export interface EntitiesState {
    patients: {
        byId: Map<string, PatientEntity>
    };
    studies: {
        byId: Map<string, StudyEntity>
    };
    series: {
        byId: Map<string, SeriesEntity>
    };
    images: {
        byId: Map<string, ImageEntity>
    };
    labels: string[];
}

export interface ImageEntity {
    imageID: string;
    series: string;
    imageNumber: number;
    annotations: ImageAnnotation[];  
    isSelected: boolean;
}

export interface SeriesEntity {
    seriesID: string;
    studyID: string;
    patientID: string;
    seriesDescription: string;
    thumbnailImageID: string;
    images: string[];
}

export interface StudyEntity {
    studyID: string;
    patientID: string;
    studyDescription: string;
    series: string[];
}

export interface PatientEntity {
    patientID: string;
    patientName: string;
    patientBirthday: number;
    studies: string[];
}

const initialState: EntitiesState = {
    patients: {
        byId: new Map<string, PatientEntity>()
    },
    studies: {
        byId: new Map<string, StudyEntity>()
    },
    series: {
        byId: new Map<string, SeriesEntity>()
    },
    images: {
        byId: new Map<string, ImageEntity>()
    },
    labels: []
};

export function entitiesReducer(
    prevState: EntitiesState = initialState,
    action: ActionType): EntitiesState {
    switch (action.type) {
        case ActionTypeKeys.IMAGE_ANNOTATION_ADDED:
            return processImageAnnotationAddedAction(prevState, action);
        case ActionTypeKeys.LABELS_DOWNLOADED:
            return processLabelsDownloadedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ANNOTATION_REMOVED:
            return processImagesAnnotationRemovedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ANNOTATION_ADDED:
            return processImagesAnnotationAddedAction(prevState, action);
        case ActionTypeKeys.IMAGES_ANNOTATIONS_DOWNLOADED:
            return processImagesAnnotationsDownloadedAction(prevState, action);
        case ActionTypeKeys.PATIENTS_FETCHED:
            return processPatientsDataFetched(prevState, action);
        default:
            return prevState;
    }
}

const processPatientsDataFetched = (prevState: EntitiesState, action: PatientsFetchedAction): EntitiesState => {

    const imageSchema = new schema.Entity(
        'images',
        {},
        {
            processStrategy: (value, parent, key) => {
                return { ...value, seriesID: parent.seriesID, annotations: [] };
            },
            idAttribute: 'imageID'
        }
    );
    const seriesSchema = new schema.Entity(
        'series',
        {
            images: [imageSchema]
        },
        {
            processStrategy: (value, parent, key) => {
                return { ...value, studyID: parent.studyID};
            },
            idAttribute: 'seriesID'
        }
    );

    const studySchema = new schema.Entity(
        'studies',
        {
            series: [seriesSchema]
        },
        {
            processStrategy: (value, parent, key) => {
                return { ...value, patientID: parent.patientID };
            },
            idAttribute: 'studyID'
        }
    );

    const patientSchema = new schema.Entity(
        'patients',
        {
            studies: [studySchema]
        },
        {
            idAttribute: 'patientID'
        }
    );

    const normalizedData = normalize(action.patients, [patientSchema]);

    // convert objects (dictionaries) to maps
    let imagesMap: Map<string, ImageEntity> = createMapFromObject(normalizedData.entities.images);
    let seriesMap: Map<string, SeriesEntity> = createMapFromObject(normalizedData.entities.series);
    let studiesMap: Map<string, StudyEntity> = createMapFromObject(normalizedData.entities.studies);
    let patientsMap: Map<string, PatientEntity> = createMapFromObject(normalizedData.entities.patients);

    let newState: EntitiesState = { ...prevState };

    newState.images = {
        byId: imagesMap
    };

    newState.series = {
        byId: seriesMap
    };

    newState.studies = {
        byId: studiesMap
    };

    newState.patients = {
        byId: patientsMap
    };

    return newState;
};

function createMapFromObject<T>(obj: Object): Map<string, T> {
    let map: Map<string, T> = new Map();
    if(obj == undefined) return map;
 
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });

    return map;
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
                    key: annotation.key,
                    value: annotation.value
                }));

                if (image) {
                    newImage = { ...image };

                } else {
                    newImage = {
                        imageID: key,
                        series: undefined,
                        imageNumber: undefined,
                        annotations: [],
                        isSelected: image.isSelected
                    };
                }

                newImage.annotations = newAnnotationsArray;
                newState.images.byId.set(newImage.imageID, newImage);
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
                newState.images.byId.set(image.imageID, image);
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
                newState.images.byId.set(image.imageID, image);
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
                series: undefined,
                imageID: action.imageID,
                imageNumber: undefined,
                annotations: [],
                isSelected: imageEntity.isSelected
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
                for (let annotation of imageEntity.annotations) {
                    // Push all other annotations into the new state
                    if (annotation.key !== imageAnnotation.key) {
                        newImageEntity.annotations.push(annotation);
                    }
                }
            } else {
                newImageEntity.annotations = [...imageEntity.annotations];
                var annotationExists = false;
                for (let annotation of newImageEntity.annotations) {
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
        newState.images.byId.set(newImageEntity.imageID, newImageEntity);
        return newState;
    };