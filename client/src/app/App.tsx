
import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from '../imageview/PatientViewer';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
        <div>
            <FolderForm />
            <PatientViewer/>
        </div>
        );
    }
}
