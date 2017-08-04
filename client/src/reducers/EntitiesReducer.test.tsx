import { ActionTypeKeys, OtherAction, ImageAnnotationAddedAction,
     ImageAnnotation, SeriesJSON, StudyJSON, UploadJSON, UploadDataDownloadedAction } from '../actions/actions';
import { entitiesReducer, EntitiesState, ImageEntity, SeriesEntity } from './EntitiesReducer';

describe('EntitiesReducer', () => {

    it('should return initial state', () => {
        // given
        let otherAction: OtherAction = {
            type: ActionTypeKeys.OTHER_ACTION
        };

        // when
        let state: EntitiesState = entitiesReducer(undefined, otherAction);

        // then
        expect(state).toEqual({
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

        let entitiesState: EntitiesState = {
            images: {
                byId: new Map([[imageEntity.imageId, imageEntity]])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            }
        };

        // when
        let state: EntitiesState = entitiesReducer(entitiesState, imageAnnotationAddedAction);

        // then
        expect(
            state.images.byId.get(imageEntity.imageId).annotations[0]
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

        let entitiesState: EntitiesState = {
            images: {
                byId: new Map()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            }
        };

        // when
        let state: EntitiesState = entitiesReducer(entitiesState, imageAnnotationAddedAction);

        // then
        expect(
            state.images.byId.get(annotation.imageId).annotations[0]
        ).toEqual({
            imageId: 'image1',
            key: 'key1',
            value: 0.5
        });
    });

    it('should handle UploadDataDownloadedAction (save images entities)', () => {

        // given
        let jsonCreator: UploadJSONCreator = new UploadJSONCreator();
        let upload: UploadJSON = jsonCreator.getUploadJSON();

        let action: UploadDataDownloadedAction = {
            type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED,
            upload
        };

        let entitiesState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            }
        };

        // when
        let state: EntitiesState = entitiesReducer(entitiesState, action);

        // then
        expect(
            state.images.byId.size
        ).toBe(3);
    });

    it('should handle UploadDataDownloadedAction (save series entities)', () => {
        // given
        let jsonCreator: UploadJSONCreator = new UploadJSONCreator();
        let upload: UploadJSON = jsonCreator.getUploadJSON();

        let action: UploadDataDownloadedAction = {
            type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED,
            upload
        };

        let entitiesState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            }
        };

        // when
        let state: EntitiesState = entitiesReducer(entitiesState, action);

        // then
        expect(
            state.series.byId.size
        ).toBe(2);
    });
});

class UploadJSONCreator {
    getUploadJSON() {
        let uploadJSON = new UploadJSON();
        uploadJSON.uploadID = 12345;
        uploadJSON.uploadDate = new Date();
        let study1 = new StudyJSON();

        study1.studyID = 'studyID 01';
        study1.studyDescription = 'This is study01 description';
        study1.patientName = 'Hlavatý Tomas';
        study1.patientBirthday = new Date(1234567890123).getTime();

        let series01 = new SeriesJSON();
        let series02 = new SeriesJSON();
        

        this.setSeries(series01, 'SeriesID01',
                       'seriesDescription: Head scan or something.',
                       '04b1f296878b9b0e2f1e2662be692ccb');

        this.setSeries(series02, 'SeriesID02',
                       'seriesDescription: Don\'t know what this thing is LOL',
                       '04914d21ab3880895f3c4e75f7ecf377');

        series01.images.push('04556da2ce2edd91fe3ca5c1f335524b');
        series02.images.push('04c899278a1b0cad90d8a2ff286f4e63');
        series02.images.push('04f518349c32cfcbe820527cee910abb');

        study1.series.push(series01);
        study1.series.push(series02);

        uploadJSON.studies.push(study1);

        return (uploadJSON);
    }

    setSeries(series: SeriesJSON, seriesID: string, seriesDescription: string, thumbnail: string) {
        series.seriesID = seriesID;
        series.seriesDescription = seriesDescription;
        series.thumbnailImageID = thumbnail;
    }

}