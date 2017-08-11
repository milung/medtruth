
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { FileSubmit } from './filesubmit/FileSubmit';
import { FileFormAction, fileChanged } from './FileFormActions';
import { FileUtils } from './FileUtils';
import { validFileExtensions } from '../constants';
import { ApiService } from '../api';
import { getFullImageURL } from '../constants';

interface OwnState {
    file: ArrayBuffer;
}

interface ConnectedDispatch {
    change: (valid: boolean, imageID: string) => FileFormAction;
}

export class FileFormComponent extends React.Component<ConnectedDispatch, OwnState> {
    constructor() {
        super();
        this.loadFile = this.loadFile.bind(this);
        this.sendFile = this.sendFile.bind(this);
        this.state = {
            file: null
        };
    }

    loadFile(event: any): boolean {
        const file: File = event.target.files[0] as File;

        // Check if a file is empty.
        if (file === undefined) {
            this.props.change(false, '');
            return false;
        }

        // Check for a valid extension of a loaded file.
        if (!FileUtils.validFile(file.name.toLowerCase(), validFileExtensions)) {
            this.props.change(false, '');
            return false;
        }

        // Reads a file from the input element.
        let valid = false;
        var fr = new FileReader();
        fr.onload = (e: any) => {
            this.setState({ file: e.target.result as ArrayBuffer });
            this.props.change(true, '');
            valid = true;
        };
        fr.readAsArrayBuffer(file);
        return valid;
    }

    async sendFile(): Promise<void> {
        const submit = document.getElementById('submit') as HTMLInputElement;
        submit.value = 'Uploading';
        submit.disabled = true;

        // Upload the data to the server.
        let resUpload = await ApiService.upload(this.state.file);
        // After that, fetch an image.
        if (!resUpload.statuses[0].err) {
            //let resImage = await ApiService.getImage(resUpload.statuses[0].id);

            let img = document.getElementById('thumbnail') as HTMLImageElement;
            //img.src = resImage.url;

            img.src = getFullImageURL(resUpload.statuses[0].id);
        }


        submit.value = 'Send';
        submit.disabled = false;
    }

    render() {
        return (
            <div>
                <div id="form">
                    <input id="loader" type="file" onChange={this.loadFile} />
                    <FileSubmit send={this.sendFile} />
                </div>
                <img id="thumbnail" width={500} height={500} />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<FileFormAction>): ConnectedDispatch {
    return {
        change: (valid: boolean, imageID: string) =>
            dispatch(fileChanged(valid, imageID)),
    };
}

export const FileForm = connect(null, mapDispatchToProps)(FileFormComponent);
