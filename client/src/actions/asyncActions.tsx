
import {
    ImageAnnotation, imagesAnnotationAddedAction,
    imagesAnnotationRemovedAction, labelsDowloadedAction,
    imagesAnnotationsDownloadedAction, PatientJSON, patientsFetched, ItemTypes, removedSelectedAction, removedAllAction
} from './actions';
import { ApiService } from '../api';
import { getImagesWherePatientIds } from '../selectors/selectors';

export function addImagesAnnotationAction(imageIds: string[], annotation: ImageAnnotation) {
    return async (dispatch) => {
        let promises = imageIds.map(imageId => ApiService.putAttributes(imageId, {
            key: annotation.key,
            value: annotation.value
        }));

        await Promise.all(promises);

        dispatch(imagesAnnotationAddedAction(imageIds, annotation));

    };
}

export function removeImagesAnnotationAction(imageIds: string[], label: string) {
    return async (dispatch) => {
        await ApiService.deleteAttributes2(imageIds, label);

        dispatch(imagesAnnotationRemovedAction(imageIds, label));

    };
}

export function downloadLabelsAction() {
    return async (dispatch): Promise<void> => {
        let labels: string[] = await ApiService.getLabels();
        dispatch(labelsDowloadedAction(labels));
    };
}

export function downloadImageAnnotations(...imageIds: string[]) {
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

export function fetchPatientsImageAnnotations(patientId: string) {
    return async (state, dispatch) => {
        let patientsImageIds: string[] =
            getImagesWherePatientIds(state, [patientId])
                .map(image => image.imageID);

        await downloadImageAnnotations(...patientsImageIds);
    };
}

export function fetchPatients() {
    return async (dispatch) => {
        let patients: PatientJSON[] = await ApiService.getPatients();

        dispatch(patientsFetched(patients));

        return patients;
    };
}

export function initializeState() {
    return async (dispatch) => {
        let patients: PatientJSON[] = await dispatch(fetchPatients());
        dispatch(fetchAllAttributes());
        dispatch(downloadLabelsAction());
    };
}

export function deleteSelected(
    itemType: ItemTypes, patientID: string, studyID: string, seriesID: string, IDs: string[]) {

    return async (dispatch) => {
        let resData = await ApiService.deleteSelected({
            itemType: itemType,
            patient: patientID,
            study: studyID,
            series: seriesID,
            IDs: IDs
        });

        dispatch(removedSelectedAction(itemType, IDs));
    };
}

export function deleteAll() {
    return async (dispatch) => {
        await ApiService.deleteAll();
        dispatch(removedAllAction());
    };
}

export function fetchAllAttributes() {
    return async  (dispatch) => {
        let imagesAnnotations: ApiService.AttributeQuery[] = await ApiService.fetchAllAttributes();
        let imagesAnnotationsMap: Map<string, ImageAnnotation[]> = new Map();
        imagesAnnotations.forEach(imageAnnotations => {
            if (imageAnnotations.attributes) {
                imagesAnnotationsMap.set(imageAnnotations.imageID, imageAnnotations.attributes);
            }
        });
        dispatch(imagesAnnotationsDownloadedAction(imagesAnnotationsMap));
    };
}
 