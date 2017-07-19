
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { VisibleFileSubmit } from './filesubmit/FileSubmit';
import { FileFormAction, fileChanged } from './FileFormActions';
import { isFileValid } from './FileUtils';
import { validFileExtensions } from '../constants';

interface ConnectedDispatch {
    change: (valid: boolean) => FileFormAction;
}

export class FileForm extends React.Component<ConnectedDispatch> {
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
            this.props.change(false);
            return false;
        }

        this.props.change(true);
        return true;
    }

    sendFile() {
        // TODO: Implement a DICOM file parser with PNG conversion.
        return;
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.loadFile} />                
                <VisibleFileSubmit />
            </form>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<FileFormAction>): ConnectedDispatch {
    return {
        change: (valid: boolean) =>
            dispatch(fileChanged(valid)),
    };
}

export const VisibleFileForm = connect(null, mapDispatchToProps)(FileForm);
