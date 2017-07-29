
import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from "../imageview/PatientViewer";

export default class App extends React.Component<{}, {}> {
    render() {
        return (
        <div>
            <FolderForm />
            <h1>TEST TEST TEST</h1>
            <PatientViewer uploadID={-1}/>
        </div>
        );
    }
}
