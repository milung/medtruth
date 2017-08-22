import * as React from 'react';
import * as Redux from 'redux';
import { ButtonComponent } from './Button';
import { ApiService } from '../api';

import { connect } from 'react-redux';
import { DeleteDialogState, deleteDialogStateChange } from '../actions/actions';


interface ConnectedDispatch {
    changeDialogState: (state: boolean) => DeleteDialogState;
}

class DeleteButtonComponent extends React.Component<ConnectedDispatch, {}> {
    constructor() {
        super();
        this.showDialog = this.showDialog.bind(this);
    }

    // async download() {
    //     let data = await ApiService.getDownload();
    // }

    showDialog() {
        this.props.changeDialogState(true);
    }

    render() {
        return (
            <a
                onClick={this.showDialog}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
                DELETE ALL
            </a>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<DeleteDialogState>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(deleteDialogStateChange(show)),
    };
}

export const DeleteAllButton = connect(null, mapDispatchToProps)(DeleteButtonComponent);