import * as React from 'react';
import { FolderForm } from "../folderForm/FolderForm";
import { PatientViewer } from "../imageview/PatientViewer";
import { BlowUp } from "./blowup";
import { connect } from "react-redux";
import { State } from "../app/store";
import { SelectionStatus } from "../selectionStatus/SelectionStatus";
import { ImageViewer } from "../gallery/ImageViewer";
import { BrowserRouter } from "react-router-dom";
import { RouteMap } from "../router/routermap";


interface OwnProps {
}

interface OwnState {

}

interface ConnectedState {
    showBlowUp: boolean;
    imageID: string;
}

class ContentComponent extends React.Component<OwnProps & ConnectedState, OwnState> {
    render() {
        return (
            <div>
                <BlowUp />
                <BrowserRouter>
                    <RouteMap />
                </BrowserRouter>
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