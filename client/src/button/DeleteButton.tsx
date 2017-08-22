import * as React from 'react';
import * as Redux from 'redux';
import { ButtonComponent } from './Button';
import { ApiService } from '../api';
// import DeleteIcon from 'material-ui-icons/Delete';
import Icon from 'material-ui/Icon';
import { connect } from 'react-redux';
import { DeleteDialogState, deleteDialogStateChange } from '../actions/actions';
import DeleteIcon from 'material-ui-icons/Delete';
import DeleteForeverIcon from 'material-ui-icons/DeleteForever';

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
            <div>
            
            <a
                onClick={this.showDialog}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
                {/* <DeleteIcon /> */}
                <DeleteForeverIcon />
                {/* <Icon color="error">delete</Icon> */}
                {/* DELETE */}
            </a>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<DeleteDialogState>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(deleteDialogStateChange(show)),
    };
}

export const DeleteButton = connect(null, mapDispatchToProps)(DeleteButtonComponent);