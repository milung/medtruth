
import * as React from 'react';
import { connect } from 'react-redux';
import { FileFormState } from '../FileFormReducer';

interface ConnectedState {
    active: boolean
}

export class FileSubmitComponent extends React.Component<ConnectedState, {}> {
    render() {
        return (
            <input type="submit" value="Send" disabled={!this.props.active} />
        )
    }
}

function mapStateToProps(state: FileFormState): ConnectedState {
    return { active: state.file.valid }
}

export const FileSubmit = connect(mapStateToProps, null)(FileSubmitComponent);
