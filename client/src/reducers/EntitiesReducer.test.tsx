import {
    ActionTypeKeys, OtherAction, ImageAnnotationAddedAction,
    ImageAnnotation, SeriesJSON, StudyJSON, UploadJSON, UploadDataDownloadedAction
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
            }
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
            }
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
            }
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
                }
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
