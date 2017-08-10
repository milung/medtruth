
import * as React from 'react';
import { FolderForm } from "../folderForm/FolderForm";
import { PatientViewer } from "../imageview/PatientViewer";
import { BlowUp } from "./blowup";
import { connect } from "react-redux";
import { State } from "../app/store";
import { SelectionStatus } from "../selectionStatus/SelectionStatus";
import { ImageViewerComponent } from "../gallery/ImageViewer";
import { BrowserRouter } from "react-router-dom";
import { RouteMap } from "../router/routermap";

interface OwnProps {
    match: any
}

interface OwnState {
}

export default class GalleryComponent extends React.Component<OwnProps, OwnState> {

    

    render() {
        return (
            <div>
                <PatientViewer />
                <ImageViewerComponent />
                <SelectionStatus />
            </div>
        );
    }
}







