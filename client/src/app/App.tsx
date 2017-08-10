
import * as React from 'react';
import { AttributeForm } from '../attributeForm/AttributeForm';
import Grid from 'material-ui/Grid';
import { AppBar, Tabs, Tab } from 'material-ui';
import { Content } from '../components/content';
import { FolderForm } from '../folderForm/FolderForm';
import { FlatButton } from 'material-ui';
import { DownloadButton } from '../button/DownloadButton';
import { PatientViewer } from '../imageview/PatientViewer';

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

export default class App extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <AppBar style={{ backgroundColor: '#212121' }}>
                    <Tabs index={false}>
                        <Tab label={'Medtruth'} style={{ fontStyle: 'bold', color: '#F44336' }} />
                        <Tab label={<label htmlFor="file"><FolderForm /></label>} />
                        <Tab label={<DownloadButton />}/>
                    </Tabs>
                </AppBar>
                <div style={{ paddingTop: '50px', margin: '0 auto' }}>
                    <Grid container={true}>
                        <Grid item={false} xs={9} sm={9} md={9}>
                            <Content />
                        </Grid>
                        <Grid item={false} xs={3} sm={3} md={3}>
                            <AttributeForm />
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}
