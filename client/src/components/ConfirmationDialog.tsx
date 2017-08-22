import * as React from 'react';
import * as Redux from 'redux';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { DeleteDialogState, deleteDialogStateChange } from "../actions/actions";
import { State } from "../app/store";
import { connect } from "react-redux";

interface OwnProps {
    deleteAll: boolean;
}

// interface OwnState {
//     open: boolean;
// }

interface ConnectedState {
    showDialog: boolean;
}

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => DeleteDialogState;
}

class ConfirmationDialogComponent extends React.Component<OwnProps & ConnectedDispatch & ConnectedState, {}> {
    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleRequestOk = this.handleRequestOk.bind(this);
        // this.state = {
        //     open: true,
        // };
    }
    
    handleRequestClose() {
        console.log("handle cancel");
        this.props.changeDialogState(false);
    };

    handleRequestOk() {
        console.log("handle ok");
        this.props.changeDialogState(false);
    };

    render() {
        console.log("delete confirmation dialog, delete all " + this.props.deleteAll);
        console.log('delete dialog open ' + this.props.showDialog);
        return (
            <div>
                {/* <Button onClick={() => this.setState({ open: true })}>Open alert dialog</Button> */}
                <Dialog open={this.props.showDialog} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>
                        {"Delete confirmation"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {(this.props.deleteAll) ? "Are you sure you want to remove everything?" :
                                "Are you sure you want to delete selected items?"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleRequestClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleRequestOk} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        showDialog: state.ui.showDeleteDialog
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<DeleteDialogState>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(deleteDialogStateChange(show)),
    };
}

export const ConfirmationDialog = connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialogComponent);