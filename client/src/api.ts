
import * as axios from 'axios';

export namespace ApiService {
    const apiEndpoint = "http://localhost:8080/";

    /*
        Route:      POST '/_upload'
        Expects:    Any datas to be sent to the server.
        -------------------------------------------------
        Sends files to the server.
    */
    const uri_Upload = apiEndpoint + '_upload';
    export function upload(...data: any[]): axios.AxiosPromise {
        const url = uri_Upload;
        let form = new FormData();
        for (var single in data) {
            form.append('data', new Blob([single], { type: 'application/octet-stream' }));
        }

        return axios.default({
            method: 'POST',
            url: url,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    /*
        Route:      GET '/_image'
        Expects:    
        -------------------------------------------
        Retreive images from the server.
    */
    const uri_Image = apiEndpoint + '_image';
    export function getImages(): axios.AxiosPromise {
        const url = uri_Image;

        return axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });
    }
}