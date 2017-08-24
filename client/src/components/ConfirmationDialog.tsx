import * as React from 'react';
import * as Redux from 'redux';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import { DeleteDialogState, deleteDialogStateChange, ItemTypes, allItemsUnselected } from "../actions/actions";
import { State } from "../app/store";
import { connect } from "react-redux";
import Typography from 'material-ui/Typography';
import { ApiService } from "../api";
import { getStudiesWhereId, getSeriesesWhereId, getImagesWhereId } from "../selectors/selectors";
import { StudyEntity, SeriesEntity, ImageEntity } from "../reducers/EntitiesReducer";
import { deleteSelected } from '../actions/asyncActions';

interface OwnState {
    deleteAll: boolean;
}

interface ConnectedState {
    showDialog: boolean;
    patients: string[];
    studies: string[];
    series: string[];
    images: string[];
    patientID: string;
    studyID: string;
    seriesID: string;
}

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => DeleteDialogState;
    deleteSelected: (itemType: ItemTypes, patientID: string, 
                     studyID: string, seriesID: string, IDs: string[]) => void;
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
            var nothingSelected = false;
            var itemType: ItemTypes;
            var patient: string = '';
            var study: string = '';
            var series: string = '';
            var IDs: string[] = [];
            if (this.props.patients.length > 0) {
                console.log('SELECTED PATIENTS');
                itemType = ItemTypes.PATIENT;
                IDs = this.props.patients;
            } else if (this.props.studies.length > 0) {
                console.log('SELECTED STUDIES');
                itemType = ItemTypes.STUDY;
                patient = this.props.patientID;
                IDs = this.props.studies;
            } else if (this.props.series.length > 0) {
                console.log('SELECTED SERIES');
                itemType = ItemTypes.SERIES;
                patient = this.props.patientID;
                study = this.props.studyID;
                IDs =this.props.series;
            } else if (this.props.images.length > 0) {
                console.log('SELECTED IMAGES');
                itemType = ItemTypes.IMAGE;
                patient = this.props.patientID;
                study = this.props.studyID;
                series = this.props.seriesID;
                IDs = this.props.images;
            } else {
                nothingSelected = true;
                console.log('NOTHING SELECTED');
            }
            if (!nothingSelected) {
                // let resData = await ApiService.deleteSelected({
                //     itemType: itemType,
                //     patient: patient,
                //     study: study,
                //     series: series,
                //     IDs: IDs
                // });
                this.props.deleteSelected(itemType, patient, study, series, IDs);
            }
            console.log('deleting selected');
        }

        console.log('SELECTIONS:');
        console.log('patients', this.props.patients);
        console.log('studies', this.props.studies);
        console.log('series', this.props.series);
        console.log('images', this.props.images);

        // TODO Dispatch redux action
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
                            <p />
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
    let patientID: string = '';
    let studyID: string = '';
    let seriesID: string = '';
    if (state.ui.selections.studies.length > 0) {
        // If at least one study is selected, get patientID from state
        let studyID = state.ui.selections.studies[0];
        let studies: StudyEntity[] = getStudiesWhereId(state, [studyID]);
        patientID = studies[0].patientID;
    } else if (state.ui.selections.series.length > 0) {
        // If at least one series is selected, get patientID and studyID from state
        let seriesID = state.ui.selections.series[0];
        let series: SeriesEntity[] = getSeriesesWhereId(state, [seriesID]);
        studyID = series[0].studyID;
        let studies: StudyEntity[] = getStudiesWhereId(state, [studyID]);
        patientID = studies[0].patientID;
    } else if (state.ui.selections.images.length > 0) {
        // If at least one image is selected, get patientID, studyID and seriesID from state
        let image = state.ui.selections.images[0];
        let images: ImageEntity[] = getImagesWhereId(state, [image]);
        console.log('image entity', images[0]);
        seriesID = images[0].seriesID;
        let series: SeriesEntity[] = getSeriesesWhereId(state, [seriesID]);
        studyID = series[0].studyID;
        let studies: StudyEntity[] = getStudiesWhereId(state, [studyID]);
        patientID = studies[0].patientID;
    }

    console.log('patientID', patientID);
    console.log('studyID', studyID);
    console.log('seriesID', seriesID);

    return {
        showDialog: state.ui.showDeleteDialog,
        patients: state.ui.selections.patients,
        studies: state.ui.selections.studies,
        series: state.ui.selections.series,
        images: state.ui.selections.images,
        patientID: patientID,
        studyID: studyID,
        seriesID: seriesID
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<DeleteDialogState>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(deleteDialogStateChange(show)),
        deleteSelected: (
            itemType: ItemTypes, patientID: string, studyID: string, seriesID: string, IDs: string[]) => {
                dispatch(allItemsUnselected());
                dispatch(deleteSelected(itemType, patientID, studyID, seriesID, IDs));
            }
            
    };
}

export const ConfirmationDialog = connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialogComponent);