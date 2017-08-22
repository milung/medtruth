import * as React from 'react';
import * as Redux from 'redux';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { DeleteDialogState, deleteDialogStateChange } from "../actions/actions";
import { State } from "../app/store";
import { connect } from "react-redux";
import Typography from 'material-ui/Typography';
import { ApiService } from "../api";

interface OwnState {
    deleteAll: boolean;
}

interface ConnectedState {
    showDialog: boolean;
}

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => DeleteDialogState;
}

class ConfirmationDialogComponent extends React.Component<ConnectedDispatch & ConnectedState, OwnState> {
    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleRequestOk = this.handleRequestOk.bind(this);
        this.state = {
            deleteAll: false,
        };
    }

    handleRequestClose() {
        console.log("cancel; delete all is " + this.state.deleteAll);
        this.props.changeDialogState(false);
    };

    async handleRequestOk() {
        console.log("ok; delete all is " + this.state.deleteAll);

        if (this.state.deleteAll) {
            // Delete everything
            console.log('deleting everything');
            let resData = await ApiService.deleteAll();
            console.log(resData);
        } else {
            // Delete selected
            console.log('deleting selected');
        }

        this.props.changeDialogState(false);
    };

    handleCheck() {
        this.setState({
            deleteAll: !this.state.deleteAll,
        }, () => {
            console.log("new checked " + this.state.deleteAll);
        })
    }

    render() {
        return (
            <div>
                {/* <Button onClick={() => this.setState({ open: true })}>Open alert dialog</Button> */}
                <Dialog open={this.props.showDialog} onRequestClose={this.handleRequestClose}>
                    <DialogTitle>
                        {"Delete confirmation"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* {(this.props.deleteAll) ? "Are you sure you want to remove everything?" : */}
                            "Do you want to delete selected items?"
                            <p/>
                            <Checkbox
                                checked={this.state.deleteAll}
                                onClick={event => (this.handleCheck())}
                            />
                            {/* <Typography color='accent'> */}
                                No, I want to delete <b>EVERYTHING</b>!
                            {/* </Typography> */}
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