
import * as React from 'react';
import { connect } from 'react-redux';
import { FileFormState } from '../FileFormReducer';

interface OwnProps {
    send: () => void;
}

interface ConnectedState {
    active: boolean;
}

export class FileSubmitComponent extends React.Component<ConnectedState & OwnProps, {}> {
    render() {
        return (
            <input type="submit" value="Send" onClick={this.props.send} disabled={!this.props.active} />
        );
    }
}

function mapStateToProps(state: FileFormState, props: OwnProps): ConnectedState & OwnProps {
    return { send: props.send, active: state.file.valid };
}

export const FileSubmit = connect(mapStateToProps, null)(FileSubmitComponent);
