import {
    ActionTypeKeys, OtherAction, ImageAnnotationAddedAction,
    ImageAnnotation, SeriesJSON, StudyJSON, UploadJSON, UploadDataDownloadedAction, LabelsDownloadedAction, ImagesAnnotationRemovedAction, ImagesAnnotationAddedAction
} from '../actions/actions';
import { entitiesReducer, EntitiesState, ImageEntity, SeriesEntity } from './EntitiesReducer';

describe('EntitiesReducer', () => {

    it('should return initial state', () => {
        // given
        let otherAction: OtherAction = {
            type: ActionTypeKeys.OTHER_ACTION
        };

        let prevState: EntitiesState = undefined;

        // when
        let newState: EntitiesState = entitiesReducer(prevState, otherAction);

        // then
        expect(newState).toEqual({
            images: {
                byId: new Map<string, ImageEntity>()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            labels: []
        });
    });

    it('should handle ImageAnnotationAddedAction (add image annotation when image entry exists)', () => {
        // given
        let annotation: ImageAnnotation = {
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        };

        let imageAnnotationAddedAction: ImageAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation
        };

        let imageEntity: ImageEntity = {
            seriesId: 'series',
            imageId: 'image1',
            annotations: []
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map([[imageEntity.imageId, imageEntity]])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, imageAnnotationAddedAction);

        // then
        expect(
            newState.images.byId.get(imageEntity.imageId).annotations[0]
        ).toEqual({
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        });
    });

    it('should handle ImageAnnotationAddedAction (add image annotation when image entry doesnt exist)', () => {

        // given
        let annotation: ImageAnnotation = {
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        };

        let imageAnnotationAddedAction: ImageAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, imageAnnotationAddedAction);

        // then
        expect(
            newState.images.byId.get(annotation.imageId).annotations[0]
        ).toEqual({
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        });
    });

    it('should handle LabelsDownloadedAction', () => {
        // given 
        let labels: string[] = ['oko', 'hlava'];
        let action: LabelsDownloadedAction = {
            type: ActionTypeKeys.LABELS_DOWNLOADED,
            labels
        };
        let prevState: EntitiesState = undefined;

        // when
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then
        expect(newState.labels.indexOf('oko') !== -1).toBeTruthy();
        expect(newState.labels.indexOf('hlava') !== -1).toBeTruthy();
    });

    it('should handle ImagesAnnotationRemovedAction', () => {
        // given
        let action: ImagesAnnotationRemovedAction = {
            type: ActionTypeKeys.IMAGES_ANNOTATION_REMOVED,
            label: 'oko',
            imageIds: ['testImageId1', 'testImageId2']
        };

        let annotation1: ImageAnnotation = {
            imageId: 'testImageId1',
            key: 'oko',
            value: 0.5
        };

        let annotation2: ImageAnnotation = {
            imageId: 'testImageId1',
            key: 'hlava',
            value: 1
        };

        let annotation3: ImageAnnotation = {
            imageId: 'testImageId2',
            key: 'oko',
            value: 0.2
        };

        let image1: ImageEntity = {
            seriesId: undefined,
            imageId: 'testImageId1',
            annotations: [annotation1, annotation2]
        };

        let image2: ImageEntity = {
            seriesId: undefined,
            imageId: 'testImageId2',
            annotations: [annotation3]
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>([
                    [image1.imageId, image1],
                    [image2.imageId, image2]
                ])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then
        expect(newState.images.byId.get('testImageId1').annotations).toEqual([annotation2]);
        expect(newState.images.byId.get('testImageId2').annotations).toEqual([]);
    });

    it('should handle ImagesAnnotationAddedAction', () => {
        // given
        let action: ImagesAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGES_ANNOTATION_ADDED,
            imageIds: ['testImageId1', 'testImageId2'],
            annotation: {
                imageId: undefined,
                key: 'oko',
                value: 0.3
            }
        };

        console.log('lenAAA ' + action.imageIds);
        let annotation1: ImageAnnotation = {
            imageId: 'testImageId1',
            key: 'oko',
            value: 0.5
        };

        let image1: ImageEntity = {
            seriesId: undefined,
            imageId: 'testImageId1',
            annotations: [annotation1]
        };

        let image2: ImageEntity = {
            seriesId: undefined,
            imageId: 'testImageId2',
            annotations: []
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>([
                    [image1.imageId, image1],
                    [image2.imageId, image2]
                ])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then
        expect(newState.images.byId.get('testImageId2').annotations.
            find(annotation => annotation.key === 'oko')).toEqual({
                imageId: 'testImageId2',
                key: 'oko',
                value: 0.3
            });

        expect(newState.images.byId.get('testImageId1').annotations.
            find(annotation => annotation.key === 'oko')).toEqual({
                imageId: 'testImageId1',
                key: 'oko',
                value: 0.3
            });
    });

    it('should handle UploadDataDownloadedAction' +
        // tslint:disable-next-line:align
        '(remove old entities from store, save new image entities and series entities)', () => {
            // given
            let upload: UploadJSON = getUploadJSON();

            let action: UploadDataDownloadedAction = {
                type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED,
                upload
            };

            let oldImageEntity: ImageEntity = {
                imageId: 'oldImageId',
                seriesId: 'oldSeriesId',
                annotations: []
            };

            let oldSeriesEntity: SeriesEntity = {
                seriesId: 'oldSseriesId',
                seriesDate: undefined,
                images: ['oldImageId'],
                seriesDescription: 'series desc',
                thumbnailImageID: 'oldImageId'
            };

            let prevState: EntitiesState = {
                images: {
                    byId: new Map<string, ImageEntity>([[oldImageEntity.imageId, oldImageEntity]])
                },
                series: {
                    byId: new Map<string, SeriesEntity>([[oldSeriesEntity.seriesId, oldSeriesEntity]])
                },
                labels: []
            };

            // when
            let newState: EntitiesState = entitiesReducer(prevState, action);

            // then
            // new entities created
            expect(
                newState.images.byId.get('04556da2ce2edd91fe3ca5c1f335524b')
            ).toEqual({
                seriesId: 'seriesId1',
                imageId: '04556da2ce2edd91fe3ca5c1f335524b',
                annotations: []
            });

            expect(
                newState.images.byId.get('04c899278a1b0cad90d8a2ff286f4e63')
            ).toEqual({
                seriesId: 'seriesId1',
                imageId: '04c899278a1b0cad90d8a2ff286f4e63',
                annotations: []
            });

            expect(
                newState.images.byId.get('04f518349c32cfcbe820527cee910abb')
            ).toEqual({
                seriesId: 'seriesId2',
                imageId: '04f518349c32cfcbe820527cee910abb',
                annotations: []
            });

            expect(
                newState.series.byId.get('seriesId1')
            ).toEqual({
                seriesId: 'seriesId1',
                seriesDescription: 'series description 1',
                thumbnailImageID: '04b1f296878b9b0e2f1e2662be692ccb',
                seriesDate: 1000000,
                images: ['04556da2ce2edd91fe3ca5c1f335524b', '04c899278a1b0cad90d8a2ff286f4e63']
            });

            // old entities removed
            expect(newState.series.byId.has('oldSeriesId')).toBeFalsy();
            expect(newState.images.byId.has('oldImageId')).toBeFalsy();

        });
});

const getUploadJSON = (): UploadJSON => {
    let imageId1: string = '04556da2ce2edd91fe3ca5c1f335524b';
    let imageId2: string = '04c899278a1b0cad90d8a2ff286f4e63';
    let imageId3: string = '04f518349c32cfcbe820527cee910abb';

    let series1: SeriesJSON = {
        seriesID: 'seriesId1',
        seriesDescription: 'series description 1',
        thumbnailImageID: '04b1f296878b9b0e2f1e2662be692ccb',
        seriesDate: 1000000,
        images: [imageId1, imageId2]
    };

    let series2: SeriesJSON = {
        seriesID: 'seriesId2',
        seriesDescription: 'series description 2',
        thumbnailImageID: '04b1f296878b9b0e2f1e2662be692ccb',
        seriesDate: 1000000,
        images: [imageId3]
    };

    let study1: StudyJSON = {
        patientName: 'patient name',
        studyDescription: 'study description',
        studyID: 'studyId',
        patientBirthday: 1000000,
        series: [series1, series2]
    };

    let upload: UploadJSON = {
        uploadID: 12345,
        uploadDate: undefined,
        studies: [study1]
    };
    return upload;
};
