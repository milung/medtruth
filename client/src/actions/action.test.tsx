import { filesUploaded, ActionTypeKeys, FilesUploadedAction, ThumbnailBlownUpAction, thumbnailBlownUp, ThumbnailBlownDownAction, thumbnailBlownDown, ImageSelectedAction, selectedImage, ImageAnnotation, ImageAnnotationAddedAction, imageAnnotationAdded, SeriesSelectedAction, seriesSelected, SeriesAllUnselectedAction, seriesAllUnselected, UploadJSON, UploadDataDownloadedAction, uploadDataDowloaded } from './actions';

describe('actions', () => {
    it('should create an action FilesUploadedAction', () => {
        // given
        let uploadId: number = 100;

        // when
        let action: FilesUploadedAction = filesUploaded(uploadId);

        // then
        expect(action).toEqual(
            {
                type: ActionTypeKeys.FILES_UPLOADED,
                uploadID: uploadId
            }
        );
    });

    it('should create an action ThumbnailBlownUpAction', () => {
        //given
        let thumbnailID: string = '91fd5c8fb387a52bceae1'

        //when
        let action: ThumbnailBlownUpAction = thumbnailBlownUp(thumbnailID);

        //then
        expect(action).toEqual(
            {
                type: ActionTypeKeys.THUMBNAIL_BLOWN_UP,
                thumbnailId: thumbnailID
            }
        );
    });

    it('should create an action ThumbnailBlownDownAction', () => {
        //given

        //when
        let action: ThumbnailBlownDownAction = thumbnailBlownDown();

        //then
        expect(action).toEqual(
            {
                type: ActionTypeKeys.THUMBNAIL_BLOWN_DOWN,
            }
        );
    });

    it('should create an action ImageSelectedAction', () => {
        //given
        let ID: string = 'imageSelectedAction';

        //when
        let action: ImageSelectedAction = selectedImage(ID);

        //then
        expect(action).toEqual({
            type: ActionTypeKeys.IMAGE_SELECTED,
            id: ID
        });
    });

    it('should create an action ImageAnnotationAddedAction', () => {
        //given
        let annot: ImageAnnotation = { imageId: '5d6s7vv', key: 'po8lkj7', value: 12345 };

        //when
        let action: ImageAnnotationAddedAction = imageAnnotationAdded(annot);

        //then
        expect(action).toEqual({
            type: ActionTypeKeys.IMAGE_ANNOTATION_ADDED,
            annotation: annot
        });
    });

    it('should create an action SeriesSelectedAction', () => {
        //given
        let ID: string = '1.3.12.1107.5.2.40'

        //when
        let action: SeriesSelectedAction = seriesSelected(ID);

        //then
        expect(action).toEqual({
            type: ActionTypeKeys.SERIES_SELECTED,
            id: ID
        });
    });

    it('should create an action SeriesAllUnselectedAction', () => {
        //given

        //when
        let action: SeriesAllUnselectedAction = seriesAllUnselected();

        //then
        expect(action).toEqual({
            type: ActionTypeKeys.SERIES_ALL_UNSELECTED
        });
    });

    it('should create an action UploadDataDownloadedAction', () => {
        //given
        let upLoad: UploadJSON = { uploadID: 12345, uploadDate: new Date(), studies: [] }

        //when
        let action: UploadDataDownloadedAction = uploadDataDowloaded(upLoad);

        //then
        expect(action).toEqual({
            type: ActionTypeKeys.UPLOAD_DATA_DOWNLOADED,
            upload: upLoad
        });
    });
});