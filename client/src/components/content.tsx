import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from '../imageview/PatientViewer';
import { BlowUp } from './blowup';
import { connect } from 'react-redux';
import { State } from '../app/store';
// import { SelectionStatus } from '../selectionStatus/SelectionStatus';
import { BrowserRouter } from 'react-router-dom';
import { RouteMap } from '../router/routermap';
import { DownloadPopUp } from './downloadpopup';
import { ConfirmationDialog } from './ConfirmationDialog';
import { TerminatedPopup } from "./terminatedUploadDialog";
import { UploadFailDialog } from "./uploadFailDialog";

interface ConnectedState {
    showBlowUp: boolean;
    imageID: string;
}

class ContentComponent extends React.Component<ConnectedState, {}> {
    render() {
        return (
            <div>
                <BlowUp />
                <DownloadPopUp />
                <ConfirmationDialog />
                <TerminatedPopup />
                <UploadFailDialog />
                <BrowserRouter >
                    <RouteMap />
                </BrowserRouter >
            </div>
        );
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        showBlowUp: state.ui.isBlownUpShowed,
        imageID: state.ui.blownUpThumbnailId
    };
}

export const Content = connect(mapStateToProps, null)(ContentComponent);