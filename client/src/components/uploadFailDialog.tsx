import * as React from 'react';
import * as Redux from 'redux';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { DeleteDialogState, deleteDialogStateChange, ItemTypes, UploadDialogState, uploadDialogStateChange } from "../actions/actions";
import { State } from "../app/store";
import { connect } from "react-redux";
import Typography from 'material-ui/Typography';
import { ApiService } from "../api";
import { getStudiesWhereId, getSeriesesWhereId, getImagesWhereId } from "../selectors/selectors";
import { StudyEntity, SeriesEntity, ImageEntity } from "../reducers/EntitiesReducer";
import Warning from 'material-ui-icons/Warning';
interface OwnState {

}

interface ConnectedState {
    showUploadDialog: boolean;

}

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => UploadDialogState;


}

export class UploadFailDialogComponent extends React.Component<ConnectedDispatch & ConnectedState, OwnState> {
    constructor(props) {
        super(props);
        this.handleRequestOk = this.handleRequestOk.bind(this);
    }



    async handleRequestOk() {

        // TODO Dispatch redux action
        this.props.changeDialogState(false);
    };

    handleCheck() {

    }

    render() {
        return (
            <div>
                {/* <Button onClick={() => this.setState({ open: true })}>Open alert dialog</Button> */}
                <Dialog open={this.props.showUploadDialog} >
                    <DialogTitle>
                        <Typography type="headline" gutterBottom style={{ textAlign: 'center' }}> 
                            Invalid selection
                         </Typography>                       
                    </DialogTitle>
                    <DialogActions>                        
                    </DialogActions>
                    <Typography type="caption" gutterBottom style={{ textAlign: 'center', padding: 20 }} >
                        {"You probably load file(s) with incorrect file format or no files were selected"}
                    </Typography>
                    <Button onClick={this.handleRequestOk} color="primary" style={{ textAlign: 'center' }}>
                            OK
                     </Button>
                </Dialog>
            </div>
        );
    }
}





function mapStateToProps(state: State): ConnectedState {
    return {
        showUploadDialog: state.ui.showUploadDialog
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<UploadDialogState>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(uploadDialogStateChange(show)),
    };
}

export const UploadFailDialog = connect(mapStateToProps, mapDispatchToProps)(UploadFailDialogComponent);