
import {
    ImageAnnotation, imagesAnnotationAddedAction,
    imagesAnnotationRemovedAction, labelsDowloadedAction,
    imagesAnnotationsDownloadedAction, PatientJSON, patientsFetched, 
    ItemTypes, removedSelectedAction, removedAllAction, addImagesAnnotationStart
} from './actions';
import { ApiService } from '../api';
import { getImagesWherePatientIds } from '../selectors/selectors';

export function addImagesAnnotationAction(imageIDs: string[], annotation: ImageAnnotation) {
    return async (dispatch) => {
        dispatch(addImagesAnnotationStart());
        await ApiService.putAttribute(imageIDs, annotation);
        dispatch(imagesAnnotationAddedAction(imageIDs, annotation));
    };
}

export function removeImagesAnnotationAction(imageIds: string[], label: string) {
    return async (dispatch) => {
        await ApiService.deleteAttributes(imageIds, label);

        dispatch(imagesAnnotationRemovedAction(imageIds, label));
    };
}

export function downloadLabelsAction() {
    return async (dispatch): Promise<void> => {
        let labels: string[] = await ApiService.getLabels();
        dispatch(labelsDowloadedAction(labels));
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
 