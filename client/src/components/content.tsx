import * as React from 'react';
import { FolderForm } from "../folderForm/FolderForm";
import { PatientViewer } from "../imageview/PatientViewer";
import { BlowUp } from "./blowup";
import { connect } from "react-redux";
import { State } from "../app/store";
import { SelectionStatus } from "../selectionStatus/SelectionStatus";
import { ImageViewerComponent } from "../gallery/ImageViewer";


interface OwnProps {
}

interface OwnState {

}

interface ConnectedState {
    showBlowUp: boolean,
    imageID: string
}

class ContentComponent extends React.Component<OwnProps & ConnectedState, OwnState> {

    render() {
        return (
            <div>
                <BlowUp />
                <div>
                    
                    <PatientViewer />

                    ======GALERIA components\content.tsx=====
                    <ImageViewerComponent  />       
                    ==================      

                    <SelectionStatus />
                </div>
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


