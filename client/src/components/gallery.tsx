
import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from '../imageview/PatientViewer';
import { BlowUp } from './blowup';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { SelectionStatus } from '../selectionStatus/SelectionStatus';
import { BrowserRouter } from 'react-router-dom';
import { RouteMap } from '../router/routermap';

interface OwnProps {
    match: any;
}

interface OwnState {
}

export default class GalleryComponent extends React.Component<OwnProps, OwnState> {

    render() {
        return (
            <div>
                <PatientViewer />
                {/* <ImageViewerComponent /> */}
                {/* <ImageViewer 
                   uploadID={1502349793991} 
                   studyID={'1.2.840.113845.11.1000000001951524609.20170524173236.1090205'} 
                   seriesID={'1.3.12.2.1107.5.2.40.50001.2017052417534013012843783.0.0.0'} 
                   />       */}
                <SelectionStatus />
            </div>
        );
    }
}