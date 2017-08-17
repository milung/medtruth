import {
    ActionTypeKeys, OtherAction, ImageAnnotationAddedAction,
    ImageAnnotation, SeriesJSON, StudyJSON,
    LabelsDownloadedAction, ImagesAnnotationRemovedAction,
    ImagesAnnotationAddedAction, ImagesAnnotationsDownloadedAction,
    PatientJSON, ImageJSON, PatientsFetchedAction
} from '../actions/actions';
import {
    entitiesReducer, EntitiesState, ImageEntity,
    SeriesEntity, PatientEntity, StudyEntity
} from './EntitiesReducer';

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
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        });
    });

    it('should handle ImageAnnotationAddedAction (add image annotation when image entry exists)', () => {
        // given
        let annotation: ImageAnnotation = {
            key: 'key1',
            value: 0.5
        };

        let imageAnnotationAddedAction: ImageAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation,
            imageID: 'image1'
        };

        let imageEntity: ImageEntity = {
            series: 'series',
            imageID: 'image1',
            imageNumber: undefined,
            annotations: []
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map([[imageEntity.imageID, imageEntity]])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, imageAnnotationAddedAction);

        // then
        expect(
            newState.images.byId.get(imageEntity.imageID).annotations[0]
        ).toEqual({
            key: 'key1',
            value: 0.5
        });
    });

    it('should handle ImageAnnotationAddedAction (add image annotation when image entry doesnt exist)', () => {

        // given
        let annotation: ImageAnnotation = {
            key: 'key1',
            value: 0.5
        };

        let imageAnnotationAddedAction: ImageAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation,
            imageID: 'image1',
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, imageAnnotationAddedAction);

        // then
        expect(
            newState.images.byId.get(imageAnnotationAddedAction.imageID).annotations[0]
        ).toEqual({
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
            imageIds: ['testimageID1', 'testimageID2']
        };

        let annotation1: ImageAnnotation = {
            key: 'oko',
            value: 0.5
        };

        let annotation2: ImageAnnotation = {
            key: 'hlava',
            value: 1
        };

        let annotation3: ImageAnnotation = {
            key: 'oko',
            value: 0.2
        };

        let image1: ImageEntity = {
            imageID: 'testimageID1',
            series: undefined,
            imageNumber: undefined,
            annotations: [annotation1, annotation2]
        };

        let image2: ImageEntity = {
            imageID: 'testimageID2',
            series: undefined,
            imageNumber: undefined,
            annotations: [annotation3]
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>([
                    [image1.imageID, image1],
                    [image2.imageID, image2]
                ])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then
        expect(newState.images.byId.get('testimageID1').annotations).toEqual([annotation2]);
        expect(newState.images.byId.get('testimageID2').annotations).toEqual([]);
    });

    it('should handle ImagesAnnotationAddedAction', () => {
        // given
        let action: ImagesAnnotationAddedAction = {
            type: ActionTypeKeys.IMAGES_ANNOTATION_ADDED,
            imageIds: ['testimageID1', 'testimageID2'],
            annotation: {
                key: 'oko',
                value: 0.3
            }
        };

        let annotation1: ImageAnnotation = {
            key: 'oko',
            value: 0.5
        };

        let image1: ImageEntity = {
            series: undefined,
            imageNumber: undefined,
            imageID: 'testimageID1',
            annotations: [annotation1]
        };

        let image2: ImageEntity = {
            series: undefined,
            imageNumber: undefined,
            imageID: 'testimageID2',
            annotations: []
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>([
                    [image1.imageID, image1],
                    [image2.imageID, image2]
                ])
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then
        expect(newState.images.byId.get('testimageID2').annotations.
            find(annotation => annotation.key === 'oko')).toEqual({
                key: 'oko',
                value: 0.3
            });

        expect(newState.images.byId.get('testimageID1').annotations.
            find(annotation => annotation.key === 'oko')).toEqual({
                key: 'oko',
                value: 0.3
            });
    });

    it('should handle ImagesAnnotationsDownloadedAction', () => {

        // given
        let annotations1: ImageAnnotation[] = [
            {
                key: 'oko',
                value: 1
            },
            {
                key: 'hlava',
                value: 0
            }
        ];

        let annotations2: ImageAnnotation[] = [
            {
                key: 'hlava',
                value: 0.5
            }
        ];

        let imageID1: string = 'imageID1';
        let imageID2: string = 'imageID2';

        let imagesAnnotations: Map<string, ImageAnnotation[]> = new Map(
            [
                [imageID1, annotations1],
                [imageID2, annotations2]
            ]
        );

        let action: ImagesAnnotationsDownloadedAction = {
            type: ActionTypeKeys.IMAGES_ANNOTATIONS_DOWNLOADED,
            imagesAnnotations: imagesAnnotations
        };

        let image2: ImageEntity = {
            series: undefined,
            imageID: 'imageID2',
            imageNumber: undefined,
            annotations: [
                {
                    key: 'krk',
                    value: 1
                }
            ]
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>(
                    [
                        [image2.imageID, image2]
                    ]
                )
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        };

        // when
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then

        // created image entity when it has not existed
        expect(newState.images.byId.get('imageID1')).toBeDefined();

        // added image annotations or 
        expect(newState.images.byId.get('imageID1').annotations).toEqual(
            [
                {
                    key: 'oko',
                    value: 1
                },
                {
                    key: 'hlava',
                    value: 0
                }
            ]
        );

        // replaced old image annotations by new ones
        expect(newState.images.byId.get('imageID2').annotations).toEqual(
            [
                {
                    key: 'hlava',
                    value: 0.5
                }
            ]
        );
    });

    it('should handle PatientsFetchedAction', () => {

        // given
        let image1: ImageJSON = {
            imageID: 'imageID1',
            imageNumber: undefined
        };

        let series1: SeriesJSON = {
            seriesID: 'seriesID1',
            seriesDate: undefined,
            seriesDescription: undefined,
            thumbnailImageID: undefined,
            images: [image1]
        };

        let study1: StudyJSON = {
            studyID: 'studyID1',
            studyDescription: undefined,
            series: [series1]
        };

        let patient1: PatientJSON = {
            patientID: 'patientID1',
            patientBirtday: undefined,
            patientName: undefined,
            studies: [study1]
        };

        let patient2: PatientJSON = {
            patientID: 'patientID2',
            patientBirtday: undefined,
            patientName: undefined,
            studies: []
        };

        let patients: PatientJSON[] = [patient1, patient2];

        let action: PatientsFetchedAction = {
            type: ActionTypeKeys.PATIENTS_FETCHED,
            patients
        };

        let prevState: EntitiesState = {
            images: {
                byId: new Map<string, ImageEntity>()
            },
            series: {
                byId: new Map<string, SeriesEntity>()
            },
            patients: {
                byId: new Map<string, PatientEntity>()
            },
            studies: {
                byId: new Map<string, StudyEntity>()
            },
            labels: []
        };

        // when 
        let newState: EntitiesState = entitiesReducer(prevState, action);

        // then
        expect(newState.images.byId.get('imageID1')).toEqual({
            imageID: 'imageID1',
            imageNumber: undefined,
            series: 'seriesID1',
            annotations: []
        });

        expect(newState.series.byId.get('seriesID1')).toEqual({
            seriesID: 'seriesID1',
            seriesDate: undefined,
            seriesDescription: undefined,
            thumbnailImageID: undefined,
            study: 'studyID1',
            images: ['imageID1']
        });

        expect(newState.studies.byId.get('studyID1')).toEqual({
            studyID: 'studyID1',
            studyDescription: undefined,
            patient: 'patientID1',
            series: ['seriesID1']
        });

        expect(newState.patients.byId.get('patientID1')).toEqual({
            patientID: 'patientID1',
            patientBirtday: undefined,
            patientName: undefined,
            studies: ['studyID1']
        });

        expect(newState.patients.byId.get('patientID2')).toEqual({
            patientID: 'patientID2',
            patientBirtday: undefined,
            patientName: undefined,
            studies: []
        });

    });
});