import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import { State, store } from "../app/store";
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { ApiService } from '../api';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import BackIcon from 'material-ui-icons/ArrowBack';
import File from 'material-ui-icons/InsertDriveFile';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import { TerminatedDialogPopup, terminatedPopupStateChange, addTerminatedUploads } from "../actions/actions";
import { TerminatedUpload, FileStatus } from "../objects";
import { downloadStyle } from "../styles/ComponentsStyle";

interface OwnProps {
}

interface OwnState {
    inUpload: boolean;
    selectedUpload: TerminatedUpload
}

interface ConnectedState {
    showTerminatedUploads: boolean;
    terminatedUploads: TerminatedUpload[]
}

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => TerminatedDialogPopup;
}

class TerminatedPopupComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch, OwnState> {

    constructor() {
        super();
        this.state = { inUpload: false, selectedUpload: null };
        this.fetchData = this.fetchData.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.uploadSelected = this.uploadSelected.bind(this);
        this.getAppBar = this.getAppBar.bind(this);
        this.keepData = this.keepData.bind(this);
        this.removeData = this.removeData.bind(this);
        this.goBack = this.goBack.bind(this);
        this.getContent = this.getContent.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.clearUpload = this.clearUpload.bind(this);
    }


    componentDidMount() {
        console.log("componentDidMount TerminatedPopupComponent");
        this.fetchData();
    }

    componentWillUpdate(nextProps, nextState) {
        console.log("componentWillUpdate");
    }

    async fetchData() {
        console.log("FETCHING");

        let data: TerminatedUpload[] = await ApiService.fetchAllTerminatedUploads() as any;
        console.log("FETCHED");
        store.dispatch(addTerminatedUploads(data));
        console.log(data);


    }

    uploadSelected(event: any, value: TerminatedUpload) {
        console.log('SELECTED');
        console.log(value);
        this.setState({ inUpload: true, selectedUpload: value })

    }

    async keepData() {
        console.log("KEEP ALL MOTHEFUOOKING DATA");
        await ApiService.keepTerminatedUpload(this.state.selectedUpload._id);
        (window as any).location = '/'
        this.clearUpload();
    }

    async removeData() {
        console.log("GET THOSE FOKING DATA OUT OF HERE");
        await ApiService.removeTerminatedUpload(this.state.selectedUpload._id);
        this.clearUpload();
    }

    clearUpload() {
        let data = this.props.terminatedUploads;
        data = data.filter((value) => {
            return value._id != this.state.selectedUpload._id;
        });
        store.dispatch(addTerminatedUploads(data));
        if (data.length > 0) {
            this.goBack();
        } else {
            this.closeDialog();
        }

    }

    closeDialog() {
        this.props.changeDialogState(false);
    }

    goBack() {
        this.setState({ inUpload: false, selectedUpload: null })
    }

    render() {
        return (
            <Dialog open={this.props.showTerminatedUploads}>
                {this.getAppBar()}
                {this.getContent()}
            </Dialog>
        );
    }


    getAppBar() {
        if (this.state.inUpload) {
            return (
                <AppBar style={downloadStyle.appBar}>
                    <Toolbar style={downloadStyle.paddingDisable}>
                        <IconButton color="contrast" aria-label="Close" onClick={this.goBack}>
                            <BackIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" style={{ fontSize: '17px', flex: 1 }}>
                            {`UploadDate: ${this.convertDate(this.state.selectedUpload._id)}`}
                        </Typography>
                        <Button color="contrast" onClick={this.keepData}>
                            Keep
                        </Button>
                        <Button color="contrast" onClick={this.removeData}>
                            Remove
                        </Button>
                    </Toolbar>
                </AppBar>
            )
        } else {
            return (
                <AppBar style={downloadStyle.appBar}>
                    <Toolbar style={downloadStyle.paddingDisable}>
                        <IconButton color="contrast" aria-label="Close" onClick={this.closeDialog}>
                            <CloseIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" style={{ fontSize: '17px', flex: 1 }}>
                            {`Failed Uploads`}
                        </Typography>
                    </Toolbar>
                </AppBar>
            )

        }

    }

    getContent() {
        if (this.state.inUpload) {
            return (
                <List>
                    {this.state.selectedUpload.filesStatus.map((fileStatus) =>
                        <ListItem>
                            <Avatar>
                                <File />
                            </Avatar>
                            <ListItemText primary={`${fileStatus.fileName}`}
                                secondary={this.getStatus(fileStatus.fileStatus)}
                            />
                        </ListItem >
                    )}
                </List>
            );
        } else {
            return (
                <List>
                    {this.props.terminatedUploads.map((value) =>
                        <ListItem
                            dense="true"
                            button="true"
                            key={value._id}
                            onClick={event => (this.uploadSelected(event, value))}
                        >
                            <ListItemText primary={`UploadDate: ${this.convertDate(value._id)}`} />
                        </ListItem>,
                    )}
                </List>)
        }
    }

    convertDate(millisecond: number): string {
        if (millisecond === -1) {
            return 'Date not specified.';
        }
        var d = new Date(millisecond);
        var datestring = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
            d.getFullYear();
        datestring += " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return datestring;
    }

    getStatus(status: FileStatus) {
        switch (status) {
            case FileStatus.OK:
                return "Upload successful";
            case FileStatus.CONVERSION_FAIL:
                return "Conversion fail !";
            case FileStatus.FILE_ALREADY_EXISTS:
                return "File already exist.";
            case FileStatus.AZURE_STORAGE_FAIL:
                return "Fail uploading to azure !";
            case FileStatus.DATABASE_CONNECTION_FAIL:
                return "Database connection problem !";
            default:
                return "";


        }
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        showTerminatedUploads: state.ui.showTerminatedUploads,
        terminatedUploads: state.ui.terminatedUploads

    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<TerminatedDialogPopup>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(terminatedPopupStateChange(show)),
    };
}

export const TerminatedPopup = connect(mapStateToProps, mapDispatchToProps)(TerminatedPopupComponent);