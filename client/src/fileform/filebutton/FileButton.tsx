
import * as React from 'react';
import { connect } from 'react-redux';
import { FileFormState } from '../FileFormReducer';

interface ConnectedState {
    active: boolean
}

export class FileButton extends React.Component<ConnectedState, {}> {
    render() {
        var text = this.props.active ? 'File is valid.' : '';
        return (
            <h1>{text}</h1>
        );
    }
}

function mapStateToProps(state: FileFormState): ConnectedState {
    return { active: state.file.valid }
}

export const VisibleFileButton = connect(mapStateToProps, null)(FileButton);
