
import {
    ImageAnnotation, imagesAnnotationAddedAction,
    imagesAnnotationRemovedAction, labelsDowloadedAction,  
    imagesAnnotationsDownloadedAction, PatientJSON, patientsFetched
} from './actions';
import { ApiService } from '../api';

export function addImagesAnnotationAction(imageIds: string[], annotation: ImageAnnotation) {
    return (dispatch) => {
        let promises = imageIds.map(imageId => ApiService.putAttributes(imageId, {
            key: annotation.key,
            value: annotation.value
        }));

        Promise.all(promises).then(() => {
            dispatch(imagesAnnotationAddedAction(imageIds, annotation));
        });
    };
}

export function removeImagesAnnotationAction(imageIds: string[], label: string) {
    return (dispatch) => {
        let promises = imageIds.map(imageId => ApiService.deleteAttributes(imageId, [label]
        ));

        Promise.all(promises).then(() => {
            dispatch(imagesAnnotationRemovedAction(imageIds, label));
        });
    };
}

export function downloadLabelsAction() {
    return (dispatch) => {
        ApiService.getLabels().then(labels => {
            dispatch(labelsDowloadedAction(labels));
        });
    };
}

export function downloadImageAnnotations(...imageIds: string[]) {
    console.log('downloading image annotations');
    return async (dispatch) => {
        let promises = imageIds.map(imageId =>
            ApiService.getAttributes(imageId)
        );

        let imagesAnnotationsMap: Map<string, ImageAnnotation[]> = new Map();
        let imagesAnnotations = await Promise.all(promises);
        imagesAnnotations.forEach(imageAnnotations => {
            if (imageAnnotations.attributes) {
                imagesAnnotationsMap.set(imageAnnotations.imageID, imageAnnotations.attributes.map(attr => (
                    {
                        key: attr.key,
                        value: attr.value
                    }
                )));
            }
        });
        dispatch(imagesAnnotationsDownloadedAction(imagesAnnotationsMap));
    };
}

export function fetchPatients() {
    return async (dispatch) => {
        let patients: PatientJSON[] = await ApiService.getPatients();

        dispatch(patientsFetched(patients));
    };
}