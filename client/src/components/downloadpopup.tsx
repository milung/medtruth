import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from '../imageview/PatientViewer';
import { BlowUp } from './blowup';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { SelectionStatus } from '../selectionStatus/SelectionStatus';
import { ImageViewer } from '../gallery/ImageViewer';
import { BrowserRouter } from 'react-router-dom';
import { RouteMap } from '../router/routermap';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { downloadStyle } from '../styles/ComponentsStyle';
import Checkbox from 'material-ui/Checkbox';
import * as Redux from 'redux';
import { DownloadStatePopup, downloadPopupStateChange } from "../actions/actions";
import { ApiService } from "../api";

interface OwnProps {
}

interface OwnState {
    labels: LabelStatus[],
    outputType: OutputType
    labelsFetched: boolean
}

interface ConnectedState {
    showDownload: boolean;
}

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => DownloadStatePopup
}

export interface LabelStatus {
    labelName: string;
    selected: boolean;
}

export enum OutputType {
    STATE_OF_LABEL, REGRESSION_VALUE
}


class DownloadPopupComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch, OwnState> {
    private allChecked;
    private indeterminate;
    private allCheckedStatus;
    private downloadDisabled;
    constructor() {
        super();
        this.downloadClick = this.downloadClick.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.checkBoxClickHandler = this.checkBoxClickHandler.bind(this);
        this.allChecked = false;
        this.allCheckedStatus = false;
        this.indeterminate = false;
        this.downloadDisabled = true;
        this.state = { labels: [], labelsFetched: false, outputType: OutputType.STATE_OF_LABEL };
    }

    async componentWillUpdate(nextProps: OwnProps & ConnectedState & ConnectedDispatch, nextState: OwnState) {
        if (nextProps.showDownload && nextState.labelsFetched == false) {
            let labels: string[] = await ApiService.getLabels();
            let stateLabels: LabelStatus[] = [];
            labels.forEach(label => {
                let labelStatus: LabelStatus = { labelName: label, selected: false };
                stateLabels.push(labelStatus);
            });
            let newStateObject =
                { labels: stateLabels, labelsFetched: true };
            this.setState(Object.assign({}, this.state, newStateObject));
        }
    }

    downloadClick() {
        let data = {labels: this.state.labels, format: this.state.outputType}
        ApiService.downloadData(data);

    }

    checkBoxClickHandler(event: any, value: LabelStatus) {
        value.selected = !value.selected;
        this.indeterminate = this.getIndeterminate();
        this.setState(this.state);
    }

    getIndeterminate(): boolean {
        if (this.state.labels.length == 0) return false;
        // if checkbox should be indeterminate
        let indeterminate: boolean = false;
        // first value of labels
        let firstValue: boolean = this.state.labels[0].selected;
        // loop through all values, if value are not the sale -> indeterminate
        for (let i = 0; i < this.state.labels.length; i++) {
            if (this.state.labels[i].selected != firstValue) {
                this.allCheckedStatus = false;
                this.downloadDisabled = false;
                return true;
            }
        }
        this.allCheckedStatus = firstValue;
        this.allChecked = this.allCheckedStatus;
        this.allCheckedStatus == 0 ? this.downloadDisabled = true : this.downloadDisabled = false

        return indeterminate;
    }

    selectAllLabels() {
        this.allChecked = !this.allChecked;
        this.state.labels.forEach(label => {
            label.selected = this.allChecked;
        });
        this.indeterminate = false;
        this.allCheckedStatus = this.allChecked;
        this.allCheckedStatus == 0 ? this.downloadDisabled = true : this.downloadDisabled = false

        this.setState(this.state);
    }

    closeDialog() {
        let newStateObject = { labels: [], labelsFetched: false };
        this.setState(Object.assign({}, this.state, newStateObject));
        this.props.changeDialogState(false);
    }

    selectFormatState() {
        let state = { outputType: OutputType.STATE_OF_LABEL }
        this.setState(Object.assign({}, this.state, state));
    }

    selectFormatReggresion() {
        let state = { outputType: OutputType.REGRESSION_VALUE }
        this.setState(Object.assign({}, this.state, state));
    }

    render() {
        return (
            <Dialog
                open={this.props.showDownload}>
                <AppBar style={downloadStyle.appBar}>
                    <Toolbar style={downloadStyle.paddingDisable}>
                        <IconButton color="contrast" aria-label="Close" onClick={this.closeDialog}>
                            <CloseIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" style={downloadStyle.flex}>
                            Download dataset
                        </Typography>
                        <Button color="contrast" disabled={this.downloadDisabled} onClick={this.downloadClick}>
                            Download
                        </Button>
                    </Toolbar>
                </AppBar>
                <ListItem dense button key={'outputState'}>
                    <ListItemText primary={`Labels format: state`} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            checked={this.state.outputType == OutputType.STATE_OF_LABEL}
                            onClick={event => (this.selectFormatState())}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem dense button key={'outputReggresion'}>
                    <ListItemText primary={`Labels format: regression value`} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            checked={this.state.outputType == OutputType.REGRESSION_VALUE}
                            onClick={event => (this.selectFormatReggresion())}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem dense button key={'selectAll'}>
                    <ListItemText primary={`Select / Unselect all items`} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            checked={this.allCheckedStatus}
                            indeterminate={this.indeterminate}
                            onClick={event => (this.selectAllLabels())}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <List>
                    {this.state.labels.map((value) =>
                        <ListItem dense button key={value.labelName}>
                            <ListItemText primary={`Label: ${value.labelName}`} />
                            <ListItemSecondaryAction>
                                <Checkbox
                                    onClick={event => (this.checkBoxClickHandler(event, value))}
                                    checked={value.selected}
                                />
                            </ListItemSecondaryAction>

                        </ListItem>,
                    )}
                </List>
            </Dialog>
        );
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        showDownload: state.ui.showDownloadPopUP
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<DownloadStatePopup>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(downloadPopupStateChange(show)),
    };
}

export const DownloadPopUp = connect(mapStateToProps, mapDispatchToProps)(DownloadPopupComponent);