
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
        var fr = new FileReader();
        fr.onload = (e: any) => {
            let data = e.target.result;
            ApiService.send(...[data, data]);
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
