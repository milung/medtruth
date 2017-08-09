
import * as axios from 'axios';

export namespace ApiService {
    const apiEndpoint = '/api';
    const uriUpload = apiEndpoint + '/upload';
    const uriImages = apiEndpoint + '/images';
    const uriDownload = apiEndpoint + '/download';
    const uriLabels = apiEndpoint + '/labels';

    /*
        Route:      POST '/upload'
        Expects:    Any datas to be sent to the server.
        -------------------------------------------------
        Sends files to the server.
        Files HAVE TO contain a header: 'ContentType': 'multipart/form-data'.
        
        Server sends a JSON, that contains a name of the sent file,
        upload id and error, if occured during uploading.
    */
    interface UploadStatus {
        name: string;
        id: string;
        err: string;
    }

    interface UploadResponse {
        error: boolean;
        errorMessage: string;
        upload_id: number;
        statuses: UploadStatus[];
    }

    export enum Status {
        SUCCESFUL,
        FAILED
    }

    export async function upload(...data: any[]): Promise<UploadResponse> {
        const url = uriUpload;
        let form = new FormData();
        data.forEach((d) => {
            form.append('data', new Blob([d], { type: 'application/octet-stream' }));
        });

        let res: axios.AxiosResponse;
        try {
            res = await axios.default({
                method: 'POST',
                url: url,
                data: form,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return { ...res.data, error: false };
        } catch (e) {
            return { upload_id: 0, statuses: null, error: true, errorMessage: 'Network Error :)' };
        }
    }

    /*
        Route:      GET '/images/:id'
        Expects:    Image ID as a parameter.
        -------------------------------------------
        Retreive images from the server.

        Server sends a URL to the image from Azure Storage,
        or null if it's invalid.
    */
    interface ImageIdResponse {
        url: string;
    }
    export async function getImage(id: string): Promise<ImageIdResponse> {
        const url = uriImages + '/' + id;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });
        return { ...res.data };
    }

    /*
        Route:      GET '/upload/:id'
        Expects:    Upload ID as a parameter.
        -------------------------------------------
        Retreive information about upload's id.
    */
    export async function getData(id: number) {
        const url = uriUpload + '/' + id;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        return { ...res.data };
    }

    /*
        Route:      PUT '/images/:id/assign'
        Expects:    Updates or creates new attributes to an image.
        -------------------------------------------
        Returns the state of an image's attributes.
    */
    interface Attribute {
        key: string;
        value: number;
    }

    export async function putAttributes(id: string, ...attributes: Attribute[]) {
        const url = uriImages + '/' + id + '/assign';

        let res: axios.AxiosResponse = await axios.default({
            method: 'PUT',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: { attributes }
        });

        return { ...res.data };
    }

    /*
        Route:      GET '/images/:id/assign'
        Expects:    Receives attributes from an image id.
        -------------------------------------------
        Returns the state of an image's attributes.
    */
    export async function getAttributes(id: string) {
        const url = uriImages + '/' + id + '/assign';

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        return { ...res.data };
    }

    export async function deleteAttributes(id: string, labels: string[]) {
        const url = uriImages + '/' + id + '/assign';

        let res: axios.AxiosResponse = await axios.default({
            method: 'DELETE',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: { labels }
        });

        return res.status === Status.SUCCESFUL ? true : false;
    }

    export async function getLabels() {
        const url = uriLabels;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        return res.data;
    }

    export async function getDownload() {
        const url = uriDownload;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'application/zip'
            },
        });

        return res.data;
    }

    interface SeriesRequest {
        uploadID:   number;
        studyID:    string;
        seriesID:   string;
    }

    interface SeriesImages {
        images: SeriesImage[];
    }

    interface SeriesImage {
        imageID: string;
        imageNumber: number;
    }

    export async function getSeriesImages(uploadID: number, studyID: string, seriesID: string): Promise<SeriesImages> {
        const url = uriImages + '/series';
        const req: SeriesRequest = { uploadID, studyID, seriesID };

        let res: axios.AxiosResponse = await axios.default({
            method: 'POST',
            url: url,
            headers: { 
                'Content-Type': 'application/json'
            },
            data: req
        });

        return res.data as SeriesImages;
    }
}