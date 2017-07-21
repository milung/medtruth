
import * as axios from 'axios';

export namespace ApiService {
    const apiEndpoint = "http://localhost:8080/";

    /*
        Route:      GET '/file'
        Expects:    Any datas to be sent to the server.
        -------------------------------------------------
        Sends files to the server.
    */
    const uri_Upload = apiEndpoint + '_upload';
    export function send(...data: any[]) {
        const url = uri_Upload;
        let form = new FormData();
        for (var single in data) {
            form.append('data', new Blob([single], { type: 'application/octet-stream' }));
        }

        axios.default({
            method: 'POST',
            url: url,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => {
            // TODO: Receive a PNG file from a response.
            console.log(res.data);
        });
    }
}