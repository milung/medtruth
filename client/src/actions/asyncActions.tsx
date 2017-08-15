
import { ImageAnnotation, imagesAnnotationAddedAction, 
    imagesAnnotationRemovedAction, labelsDowloadedAction } from './actions';
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