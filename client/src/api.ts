
import * as axios from 'axios';

export namespace ApiService {
    const apiEndpoint = 'http://medtruth.azurewebsites.net/api';
    const uriUpload = apiEndpoint + '/upload';
    const uriImages = apiEndpoint + '/images';

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
        statuses: UploadStatus[];
    }

    export async function upload(...data: any[]): Promise<UploadResponse> {
        const url = uriUpload;
        let form = new FormData();
        data.forEach((d) => {
            form.append('data', new Blob([d], { type: 'application/octet-stream' }));
        });

        let res: axios.AxiosResponse = await axios.default({
            method: 'POST',
            url: url,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return {...res.data};
    }

    /*
        Route:      GET '/images/:id'
        Expects:    Upload ID as a parameter.
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
        return {...res.data};
    }

    /*  
        TODO:
        /_images/latest
    */
}