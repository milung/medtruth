
import * as React from 'react';
import { FolderForm } from "../folderForm/FolderForm";
import { PatientViewer } from "../imageview/PatientViewer";
import { BlowUp } from "./blowup";
import { connect, Store } from "react-redux";
import { State } from "../app/store";
import { SelectionStatus } from "../selectionStatus/SelectionStatus";
import { ImageViewerComponent } from "../gallery/ImageViewer";
import { BrowserRouter } from "react-router-dom";
import { RouteMap } from "../router/routermap";
import { ApiService } from "../api";


interface OwnProps {
    match: any
}

interface OwnState {

}

export default class InnerComponent extends React.Component<OwnProps, OwnState> {

    async componentWillUpdate(nextProps, nextState) {
        let uploadID: number = this.props.match.params.uploadID;
        let studyID: string = this.props.match.params.study;
        let seriesID: string = this.props.match.params.series
        let resData = await ApiService.getSeriesImages(uploadID, studyID, seriesID);

    }

    render() {
        console.log("rendering inner component");
        console.log(this.state);
        console.log(this.props.match.params);

        return (
            <div>
                <p>{this.props.match.params.uploadID}</p>
                <p>{this.props.match.params.study}</p>
                <p>{this.props.match.params.series}</p>
            </div>
        );
    }
}
