
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { FileFormAction, fileChanged } from './FileFormActions';
import { isFileValid } from './FileUtils';
import { validFileExtensions } from '../constants';

interface ConnectedDispatch {
    change: (valid: boolean) => FileFormAction;
}

export class FileForm extends React.Component<ConnectedDispatch, {}> {
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

        // TODO: Implement a DICOM file parser with PNG conversion.

        this.props.change(true);
        return true;
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.loadFile} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<{}>): ConnectedDispatch => ({
    change: (valid: boolean) =>
        dispatch(fileChanged(valid)),
});

export const VisibleFileForm = connect(null, mapDispatchToProps)(FileForm);
