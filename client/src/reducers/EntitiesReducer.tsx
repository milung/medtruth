import {
    ActionType, ActionTypeKeys, ImageAnnotation,
    ImageAnnotationAddedAction, PatientJSON, LabelsDownloadedAction, ImagesAnnotationRemovedAction,
    ImagesAnnotationAddedAction, ImagesAnnotationsDownloadedAction, PatientsFetchedAction, ImageJSON,
    RemovedAllAction, RemovedSelectedAction, ItemTypes
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
    seriesID: string;
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
        case ActionTypeKeys.REMOVED_ALL:
            return processRemovedAllAction(prevState, action);
        case ActionTypeKeys.REMOVED_SELECTED:
            return processRemovedSelectedAction(prevState, action);
        case ActionTypeKeys.REMOVED_SELECTED:
            return processRemovedSelectedAction(prevState, action);
        default:
            return prevState;
    }
}

const processRemovedSelectedAction = (prevState: EntitiesState, action: RemovedSelectedAction): EntitiesState => {

    let newState: EntitiesState = { ...prevState };

    // remove images
    if (action.itemType === ItemTypes.IMAGE) {
        let removedImages: ImageEntity[] = removeImages(prevState, newState, action.itemIDs);
        deleteImageReferences(prevState, newState, removedImages);
    }

    // remove series
    if (action.itemType === ItemTypes.SERIES) {
        let removedSeries: SeriesEntity[] = removeSeries(prevState, newState, action.itemIDs);
        deleteSeriesReferences(prevState, newState, removedSeries);
    }

    // remove studies
    if (action.itemType === ItemTypes.STUDY) {
        let removedStudies: StudyEntity[] = removeStudies(prevState, newState, action.itemIDs);
        deleteStudyReferences(prevState, newState, removedStudies);
    }

    // remove patients
    if (action.itemType === ItemTypes.PATIENT) {
        let removedPatients: PatientEntity[] = removePatients(prevState, newState, action.itemIDs);
    }

    return newState;
};

function deleteImageReferences(prevState: EntitiesState, newState: EntitiesState, images: ImageEntity[]) {

    if (images.length > 0) {
        newState.series = { ...prevState.series };
        newState.series.byId = new Map(prevState.series.byId);

        let seriesID: string = images[0].seriesID;
        let series: SeriesEntity = newState.series.byId.get(seriesID);

        if (series) {
            let imageIDs: string[] = images.map(image => image.imageID);
            let newSeries: SeriesEntity = { ...series };
            newSeries.images = series.images.filter(imageID => imageIDs.indexOf(imageID) === -1);
            newState.series.byId.set(newSeries.seriesID, series);
        }
    }
}

function deleteSeriesReferences(prevState: EntitiesState, newState: EntitiesState, series: SeriesEntity[]) {

    if (series.length > 0) {
        newState.studies = { ...prevState.studies };
        newState.studies.byId = new Map(prevState.studies.byId);

        let studyID: string = series[0].studyID;
        let study: StudyEntity = newState.studies.byId.get(studyID);

        if (study) {
            let seriesIDs: string[] = series.map(serie => serie.seriesID);
            let newStudy: StudyEntity = { ...study };
            newStudy.series = study.series.filter(seriesID => seriesIDs.indexOf(seriesID) === -1);
            newState.studies.byId.set(newStudy.studyID, study);
        }
    }
}

function deleteStudyReferences(prevState: EntitiesState, newState: EntitiesState, studies: StudyEntity[]) {

    if (studies.length > 0) {
        newState.patients = { ...prevState.patients };
        newState.patients.byId = new Map(prevState.patients.byId);

        let patientID: string = studies[0].patientID;
        let patient: PatientEntity = newState.patients.byId.get(patientID);

        if (patient) {
            let studyIDs: string[] = studies.map(study => study.studyID);
            let newPatient: PatientEntity = { ...patient };
            newPatient.studies = patient.studies.filter(studyID => studyIDs.indexOf(studyID) === -1);
            newState.patients.byId.set(newPatient.patientID, patient);
        }
    }
}

/*
* Function mutates newState object!
*/
function removeImages(prevState: EntitiesState, newState: EntitiesState, imageIDs: string[]): ImageEntity[] {
    newState.images = { ...prevState.images };
    newState.images.byId = new Map(prevState.images.byId);
    return removeFromMap(newState.images.byId, imageIDs);
}

/*
* Function mutates newState object!
*/
function removeSeries(prevState: EntitiesState, newState: EntitiesState, seriesIDs: string[]): SeriesEntity[] {
    newState.series = { ...prevState.series };
    newState.series.byId = new Map(prevState.series.byId);

    let removedSeries: SeriesEntity[] = removeFromMap(newState.series.byId, seriesIDs);

    let idsOfImagesToRemove: string[] = [];
    removedSeries.forEach(series => idsOfImagesToRemove.push(...series.images));
    removeImages(prevState, newState, idsOfImagesToRemove);

    return removedSeries;
}

/*
* Function mutates newState object!
*/
function removeStudies(prevState: EntitiesState, newState: EntitiesState, studyIDs: string[]): StudyEntity[] {
    newState.studies = { ...prevState.studies };
    newState.studies.byId = new Map(prevState.studies.byId);

    let removedStudies: StudyEntity[] = removeFromMap(newState.studies.byId, studyIDs);

    let idsOfSeriesToRemove: string[] = [];
    removedStudies.forEach(study => idsOfSeriesToRemove.push(...study.series));
    removeSeries(prevState, newState, idsOfSeriesToRemove);

    return removedStudies;
}

/*
* Function mutates newState object!
*/
function removePatients(prevState: EntitiesState, newState: EntitiesState, patientIDs: string[]): PatientEntity[] {
    newState.patients = { ...prevState.patients };
    newState.patients.byId = new Map(prevState.patients.byId);

    let removedPatients: PatientEntity[] = removeFromMap(newState.patients.byId, patientIDs);

    let idsOfStudiesToRemove: string[] = [];
    removedPatients.forEach(patient => idsOfStudiesToRemove.push(...patient.studies));
    removeStudies(prevState, newState, idsOfStudiesToRemove);

    return removedPatients;
}

function removeFromMap<T>(map: Map<string, T>, keys: string[]): T[] {
    let removed: T[] = [];
    keys.forEach(key => {
        let element: T = map.get(key);
        if (element) {
            map.delete(key);
            removed.push(element);
        }
    });
    return removed;
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
                return { ...value, studyID: parent.studyID };
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
    if (obj === undefined) { return map; }

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
                        seriesID: undefined,
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
        newState.labels = [...action.labels];
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
                seriesID: undefined,
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

const processRemovedAllAction = (prevState: EntitiesState, action: RemovedAllAction): EntitiesState => {
    // TODO delete all entities from the store 
    return null;
};

// const processRemovedSelectedAction = (prevState: EntitiesState, action: RemovedSelectedAction): EntitiesState => {
//     // TODO delete selected entities from the state
//     return null;
// }
