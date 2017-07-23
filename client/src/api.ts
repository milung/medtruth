
import * as axios from 'axios';

export namespace ApiService {
    const apiEndpoint   = 'http://localhost:8080';
    const uriUpload     = apiEndpoint + '/_upload';
    const uriImages     = apiEndpoint + '/_images';

    /*
        Route:      POST '/_upload'
        Expects:    Any datas to be sent to the server.
        -------------------------------------------------
        Sends files to the server.
        Files HAVE TO contain a header: 'ContentType': 'multipart/form-data'.
    */
    export function upload(...data: any[]): axios.AxiosPromise {
        const url = uriUpload;
        let form = new FormData();
        data.forEach((d) => {
            form.append('data', new Blob([d], { type: 'application/octet-stream' }));
        });

        return axios.default({
            method: 'POST',
            url: url,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    /*
        Route:      GET '/_images'
        Expects:    Nothing.
        -------------------------------------------
        Retreive images from the server.
    */
    export function getImages(): axios.AxiosPromise {
        const url = uriImages;

        return axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });
    }

    /*  
        TODO:
        /_images/latest
        /_images/:id
    */
}