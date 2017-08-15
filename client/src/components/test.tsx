
import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from '../imageview/PatientViewer';
import { BlowUp } from './blowup';
import { connect, Store } from 'react-redux';
import { State } from '../app/store';
import { SelectionStatus } from '../selectionStatus/SelectionStatus';
import { ImageViewer } from '../gallery/ImageViewer';
import { BrowserRouter } from 'react-router-dom';
import { RouteMap } from '../router/routermap';
import { ApiService } from '../api';
import { store } from '../app/store';
import { lastStudySelected } from '../actions/actions';

interface OwnProps {
    match: any;
}

interface OwnState {
}

export default class InnerComponent extends React.Component<OwnProps, OwnState> {
    constructor() {
        super();
        console.log('constructors');
    }

    componentWillMount() {
        let studyID: string = this.props.match.params.study;
        console.log('dispatch', studyID);
        store.dispatch(lastStudySelected(studyID));
    }

    async componentWillUpdate(nextProps, nextState) {
        /*
        let uploadID: number = this.props.match.params.uploadID;
        let studyID: string = this.props.match.params.study;
        let seriesID: string = this.props.match.params.series
        let resData = await ApiService.getSeriesImages(uploadID, studyID, seriesID);

        console.log("dispatch ", studyID);
        store.dispatch(lastStudySelected(studyID));
        */
    }

    render() {
        console.log('rendering inner component');

        return (
            <div>
                <ImageViewer
                    uploadID={this.props.match.params.uploadID}
                    studyID={this.props.match.params.study}
                    seriesID={this.props.match.params.series}
                />
            </div>
        );
    }
}