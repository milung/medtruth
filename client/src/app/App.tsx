
import * as React from 'react';
import { FolderForm } from '../folderForm/FolderForm';
import { PatientViewer } from '../imageview/PatientViewer';
import { AttributeForm } from '../attributeForm/AttributeForm';
import { SelectionStatus } from '../selectionStatus/SelectionStatus';
import Grid from 'material-ui/Grid';

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

export default class App extends React.Component<{}, {}> {
    render() {
        return (
        <div>
            <Grid container={true}>
                <Grid item xs={9} sm={9} md={9}>
                    <FolderForm />
                    <PatientViewer />     
                    <SelectionStatus />
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <AttributeForm />
                </Grid>
            </Grid>
        </div>
        );
    }
}
