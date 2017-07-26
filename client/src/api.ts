
import * as axios from 'axios';

export namespace ApiService {
    const apiEndpoint   = 'http://medtruth.azurewebsites.net/api';
    const uriUpload     = apiEndpoint + '/_upload';
    const uriImages    = apiEndpoint + '/_images';

    /*
        Route:      POST '/_upload'
        Expects:    Any datas to be sent to the server.
        -------------------------------------------------
        Sends files to the server.
        Files HAVE TO contain a header: 'ContentType': 'multipart/form-data'.
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
        Route:      GET '/_images'
        Expects:    Nothing.
        -------------------------------------------
        Retreive images from the server.
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
        /_images/:id
    */
}