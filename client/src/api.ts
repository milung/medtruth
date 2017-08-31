
import * as axios from 'axios';
import { LabelStatus, OutputType } from './components/downloadpopup';
import * as ios from 'socket.io-stream';
import * as io from 'socket.io-client';
import { ItemTypes } from './actions/actions';
import { store } from "./app/store";
import { changeUploadStatus } from "./actions/actions";

export namespace ApiService {
    const apiEndpoint = '/api';
    //const apiEndpoint = 'http://localhost:8080/api'

    /* change this */
    const uriUpload = apiEndpoint + '/upload';
    const uriImages = apiEndpoint + '/images';
    const uriDownload = apiEndpoint + '/download';
    const uriLabels = apiEndpoint + '/labels';
    const uriPatients = apiEndpoint + '/patients';
    const uriDelete = apiEndpoint + '/delete';

    export function uploadSocket(data: any[], onUpload: () => void): Promise<any> {
        return new Promise((res, rej) => {
            let up = io();
            // Right after we connect.
            up.on('connect', () => {
                let filesDone = 0;
                let allFilesNumber = data.length;
                // Connect to the upload socket point.
                up.emit(':upload', {});
                // Whenever we receive an 'ok' status, we send files over the wire.
                up.on(':upload.ok', async () => {
                    // If we sent all the files, notify the server to end.
                    if (data.length === 0) {
                        console.log('UPLOAD END');

                        up.emit(':upload.end', {});
                        // Resolve this promise.

                        // Otherwise, emit a 'data' action, that sends the files.
                    } else {
                        let blob = data.pop();
                        let stream = ios.createStream();
                        ios(up).emit(':upload.data', stream, { size: blob.size, name: blob.name });
                        ios.createBlobReadStream(blob, { highWaterMark: 5000000 }).pipe(stream);
                        // Callback for the onUpload event.
                        onUpload();
                    }
                });
                up.on(':upload.error', () => {
                    rej();
                });
                up.on(':upload.completed',(data) => {
                    console.log("THIS FELLA IS DONE");
                    console.log(data);
                    filesDone++;
                    let status = "Files completed: "+filesDone+"/"+allFilesNumber;
                    store.dispatch(changeUploadStatus(true,status));
                });
                up.on(':upload.alldone', ()=>{
                    up.disconnect();
                    res();
                });
            });
        });
    }

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
    /*
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

*/
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
        console.log('putting attributes api');
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

    export async function deleteAttributes2(imageIDs: string[], labelToRemove: string) {
        const url = uriImages + '/assign';

        let res: axios.AxiosResponse = await axios.default({
            method: 'DELETE',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: { imageIDs, labelToRemove }
        });

        return res.status === Status.SUCCESFUL ? true : false;
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

    export async function getDownloadImgMap() {
        const url = uriDownload + '/img_map';

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {
                'Accept': 'application/zip'
            },
        });

        return res.data;
    }

    export async function getPatients() {
        const url = uriPatients;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        return res.data;
    }

    interface SeriesRequest {
        uploadID: number;
        studyID: string;
        seriesID: string;
    }

    interface SeriesImage {
        imageID: string;
        imageNumber: number;
    }

    export async function getSeriesImages(uploadID: number, studyID: string, seriesID: string): Promise<SeriesImage[]> {
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

        return res.data as SeriesImage[];
    }

    interface DownloadData {
        labels: LabelStatus[];
        format: OutputType;
    }

    export async function downloadData(data: DownloadData) {
        const url = uriDownload;

        let res = await axios.default({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
        let downloadID = res.data.id;
        console.log('downloadID ', downloadID);

        // TRIGGERING DOWNLOAD
        let click = (node) => {
            var event = new MouseEvent('click');
            node.dispatchEvent(event);
        };
        let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as any;
        saveLink.href = '/api/download/' + downloadID;
        saveLink.download = 'data.zip';
        click(saveLink);
    }

    export async function deleteAll() {
        // const url = uriPatients;
        const url = uriDelete;

        let res: axios.AxiosResponse = await axios.default({
            method: 'DELETE',
            url: url,
            headers: {}
        });

        return res.data;

        // return res.status === Status.SUCCESFUL ? true : false;
    }

    export interface DeleteSelectedData {
        itemType: ItemTypes;
        patient: string;
        study: string;
        series: string;
        IDs: string[];        // array of IDs of items to be deleted 
    }

    export async function deleteSelected(data: DeleteSelectedData) {
        const url = uriDelete;

        let res: axios.AxiosResponse = await axios.default({
            method: 'POST',
            url: url,
            headers: {},
            data: data
        });

        return res.data;
        // return res.status === Status.SUCCESFUL ? true : false;
    }

    export interface AttributeQuery {
        imageID: string;
        attributes: Attribute[];
    }

    export async function fetchAllAttributes(): Promise<AttributeQuery[]> {
        const url = uriImages + '/assign';

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        return res.data;
    }

    export async function fetchAllTerminatedUploads(): Promise<AttributeQuery[]> {
        const url = uriUpload + '/terminated/list';

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        return res.data;
    }

    export async function keepTerminatedUpload(id: number){
        const url = uriUpload + '/keep/'+id;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        
    }

    export async function removeTerminatedUpload(id: number) {
        const url = uriUpload + '/delete/'+id;

        let res: axios.AxiosResponse = await axios.default({
            method: 'GET',
            url: url,
            headers: {}
        });

        
    }

    
}