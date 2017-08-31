
import * as React from 'react';
import { AttributeForm } from '../attributeForm/AttributeForm';
import Grid from 'material-ui/Grid';
import { AppBar, Tabs, Tab } from 'material-ui';
import { Content } from '../components/content';
import { FolderForm } from '../folderForm/FolderForm';
import { FlatButton, IconButton } from 'material-ui';
import { DownloadButton } from '../button/DownloadButton';
import { PatientViewer } from '../imageview/PatientViewer';
import { DeleteButton } from '../button/DeleteButton';
import { TerminatedButton } from "../button/TerminatedButton";
import { State } from "./store";
import { connect } from "react-redux";
import { OneLineInformationComponent } from "../oneLineInformation/OneLineInformation";

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

interface ConnectedState {
    disabled: boolean;
    uploading: boolean;
    text: string
}
export class AppComponent extends React.Component<ConnectedState, {}> {
    render() {
        let disabled = this.props.disabled;
        return (
            <div>
                <AppBar style={{ backgroundColor: '#212121' }}>
                    <Tabs index={false} onChange={() => { }}>
                        <Tab label={'Medtruth'} style={{ fontStyle: 'bold', color: '#F44336' }} />
                        <Tab label={<label htmlFor="file"> <FolderForm /></label>} />
                        <Tab label={<DownloadButton />} />
                        <Tab label={<DeleteButton />}/>
                        {this.getTerminatedTab()}
                        {this.getUploadStatus()}
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

    getTerminatedTab = () => {
        if(this.props.disabled){
            return (<Tab disabled/>);
        }else {
            return (<Tab label={<TerminatedButton />}/>);
        }
    }
    
    getUploadStatus = () => {
        if(this.props.uploading){
            return (<OneLineInformationComponent text={this.props.text}/>);
        }else {
            return (<OneLineInformationComponent text=''/>);
        }
    }

}

function mapStateToProps(state: State): ConnectedState {
    return {
        disabled: state.ui.terminatedUploads.length <= 0,
        uploading: state.ui.uploading,
        text: state.ui.uploadingText
    };
}

export const App = connect(mapStateToProps, null)(AppComponent);