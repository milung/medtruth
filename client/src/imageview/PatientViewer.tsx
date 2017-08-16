import * as React from 'react';
import * as Redux from 'redux';
import Grid from 'material-ui/Grid';
import { PatientProps } from './PatientView';
import { imageStyle } from '../styles/ComponentsStyle';
import { PatientView } from './PatientView';
import { ApiService } from '../api';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { UploadJSON, UploadDataDownloadedAction, uploadDataDowloaded } from '../actions/actions';
import { StudiesProps } from "./StudyView";

interface ArrayOfPatients {
    wait: boolean;
    patientList: PatientProps[];
}

interface ConnectedState {
    uploadID: number;
}

interface ConnectedDispatch {
    uploadedDataDownloaded: (upload: UploadJSON) => UploadDataDownloadedAction;
}

class PatientViewerComponent extends React.Component<ConnectedState & ConnectedDispatch, ArrayOfPatients> {

    constructor() {       
        super();
        this.state = {
            wait: false,
            patientList: []
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.uploadID !== this.props.uploadID) {
            this.receiveData(nextProps.uploadID);
        }
    }

    componentDidMount() {
        this.receiveData(this.props.uploadID);
    }

    async receiveData(uploadID: number): Promise<void> {
        
        let patId = 10;
        let imageId = 10;

        this.setState({ wait: true });
        
        let resData = await ApiService.getData(uploadID/*12345*/);
       
       // this.props.uploadedDataDownloaded(resData);
        console.log('got data', resData);
        let patients = [];

        for (let patient of resData.listOfPatients) {
            let tempSeries = [];
           // console.log("len ist of patients",resData.listOfPatients.length)
            let tmpStudies=[];

            for (let tmpStudy of patient.studies) {
              //  console.log("tmpStudy",tmpStudy)
                let study: StudiesProps = {
                    // TODO REMOVE PATIENT ID
                    patientID: patient.patientID,
                    studyID: tmpStudy.studyID,
                    studyDescription: tmpStudy.studyDescription,
                    series: null,
                   
                };
                tmpStudies.push(study);
                imageId++;
            }
            let tempPatient: PatientProps = {
                patientId: patient.patientID,
                patientName: patient.patientName,
                dateOfBirth: patient.dateOfBirth,   
                studies: tmpStudies,           
                
            };
            patients.push(tempPatient);
            patId++;
            console.log('studies',tmpStudies)
            console.log()
        }
       this.setState(Object.assign({}, { wait: false, patientList: patients }));
    }

    render() {
        if (!this.state.wait) {
            return (
                <div style={{marginLeft: 10, marginBottom: 10, marginRight: 10}}>
                    <Grid container={true} /*gutter={16}*/>
                        {this.state.patientList.map(value =>
                            <Grid
                                item="false"
                                xs={12} 
                                sm={12} 
                                md={12}
                                style={imageStyle.seriesStyle}
                                key={value.patientId}
                            >
                            {}
                                <PatientView {...value} />
                            </Grid>
                        )}
                    </Grid>
                </div>
            );
        } else {
            return <div />;
        }
    }
}

function mapStateToProps(state: State): ConnectedState {
    console.log('uploadid: ' + state.files.lastUploadID);

    return { uploadID: state.files.lastUploadID };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<UploadDataDownloadedAction>): ConnectedDispatch {
    return ({
        uploadedDataDownloaded: (upload: UploadJSON) => dispatch(uploadDataDowloaded(upload))
    });
}

export const PatientViewer = connect(mapStateToProps, mapDispatchToProps)(PatientViewerComponent);