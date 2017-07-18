
import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { VisibleFileButton } from './filebutton/FileButton';
import { FileFormAction, fileChanged } from './FileFormActions';
import { isFileValid } from './FileUtils';
import { validFileExtensions } from '../constants';

interface ConnectedDispatch {
    change: (valid: boolean) => FileFormAction;
}

interface OwnState{
    valid: boolean // enables/disables submit button
}

export class FileForm extends React.Component<ConnectedDispatch, OwnState> {
    constructor() {
        super();
        this.state = {valid: false};
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
            this.setState({valid: false});
            return false;
        }

        // TODO: Implement a DICOM file parser with PNG conversion.

        this.props.change(true);
        this.setState({valid: true});
        return true;
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.loadFile} />
                <input type="submit" value="Submit" disabled={!this.state.valid} />
                <VisibleFileButton />
            </form>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ConnectedDispatch>): ConnectedDispatch {
    return {
        change: (valid: boolean) =>
            dispatch(fileChanged(valid)),
    };
}

export const VisibleFileForm = connect(null, mapDispatchToProps)(FileForm);
