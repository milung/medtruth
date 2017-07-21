
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { FileSubmit } from './filesubmit/FileSubmit';
import { FileFormAction, fileChanged } from './FileFormActions';
import { isFileValid } from './FileUtils';
import { validFileExtensions } from '../constants';
import { ApiService } from '../api';

interface ConnectedDispatch {
    change: (valid: boolean, imageID: string) => FileFormAction;
}

export class FileFormComponent extends React.Component<ConnectedDispatch> {
    constructor() {
        super();
        this.loadFile = this.loadFile.bind(this);
    }

    loadFile(event: any): boolean {
        const file: File = event.target.files[0] as File;

        // Check if a file is empty.
        if (file === undefined) {
            return false;
        }

        // Check for a valid extension of a loaded file.
        if (!isFileValid(file.name.toLowerCase(), validFileExtensions)) {
            this.props.change(false, '');
            return false;
        }

        this.props.change(true, '');

        // Reads a file from the input element.
        var fr = new FileReader();
        fr.onload = (e: any) => {
            let data = e.target.result;
            // Uploads the data to the server.
            ApiService.upload(...[data, data])
                .then((res) => {
                    // After that, fetch an image.
                    ApiService.getImages()
                        .then((res) => {
                            let img = document.getElementById('thumbnail') as HTMLImageElement;
                            img.height = 500;
                            img.width = 500;
                            img.src = res.data;
                        })
                        .catch((res) => {
                            // Error if fetching an image went wrong.
                        });
                })
                .catch((res) => {
                    // Error if upload to the server went wrong.
                });
        };
        fr.readAsArrayBuffer(file);

        return true;
    }

    sendFile() {
        return;
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.loadFile} />
                <FileSubmit />
                <img id="thumbnail"></img>
            </form>
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
