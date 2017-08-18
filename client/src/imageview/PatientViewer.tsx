import * as React from 'react';
import * as Redux from 'redux';
import Grid from 'material-ui/Grid';
import { PatientProps } from './PatientView';
import { imageStyle } from '../styles/ComponentsStyle';
import { PatientView } from './PatientView';
import { ApiService } from '../api';
import { connect } from 'react-redux';
import { State } from '../app/store';
//import { UploadJSON, UploadDataDownloadedAction, uploadDataDowloaded } from '../actions/actions';
import { StudiesProps } from './StudyView';
import Typography from 'material-ui/Typography';
import { PatientEntity } from "../reducers/EntitiesReducer";
import { getPatients } from "../selectors/selectors";
import { AllItemsUnselectedAction, ActionType, allItemsUnselected } from "../actions/actions";

interface ConnectedState {
    patientList: PatientEntity[];
}

interface ConnectedDispatch {
    deselectAllItems: () => AllItemsUnselectedAction;
}

class PatientViewerComponent extends React.Component<ConnectedState & ConnectedDispatch, {}> {

    constructor() {
        super();
    }

    // componentWillUpdate(nextProps, nextState) {
    //     if (nextProps.uploadID !== this.props.uploadID) {
    //         this.receiveData(nextProps.uploadID);
    //     }
    // }

    // componentDidMount() {
    //     this.receiveData();
    // }

    // async receiveData(): Promise<void> {

    //     let patId = 10;
    //     let imageId = 10;

    //     this.setState({ wait: true });

    //     let resData = await ApiService.getData(221);

    //     // this.props.uploadedDataDownloaded(resData);
    //     console.log('got data', resData);
    //     let patients = [];

    //     for (let patient of resData.listOfPatients) {
    //         let tempSeries = [];
    //         // console.log("len ist of patients",resData.listOfPatients.length)
    //         let tmpStudies = [];

    //         for (let tmpStudy of patient.studies) {
    //             //  console.log("tmpStudy",tmpStudy)
    //             let study: StudiesProps = {
    //                 // TODO REMOVE PATIENT ID
    //                 patientID: patient.patientID,
    //                 studyID: tmpStudy.studyID,
    //                 studyDescription: tmpStudy.studyDescription,
    //                 series: null,

    //             };
    //             tmpStudies.push(study);
    //             imageId++;
    //         }
    //         let tempPatient: PatientProps = {
    //             patientId: patient.patientID,
    //             patientName: patient.patientName,
    //             dateOfBirth: patient.dateOfBirth,
    //             studies: tmpStudies,

    //         };
    //         patients.push(tempPatient);
    //         patId++;
    //         console.log('studies', tmpStudies)
    //         console.log()
    //     }
    //     this.setState(Object.assign({}, { wait: false, patientList: patients }));
    // }

    render() {
        // if (!this.state.wait) {
            return (
                <div style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
                    <Typography type="display1" component="p" style={{ margin: 20 }}>
                        List of patients
                    </Typography>
                    <Grid container={true} /*gutter={16}*/>
                        {this.props.patientList.map(value =>
                            <Grid
                                item="false"
                                xs={12}
                                sm={12}
                                md={12}
                                style={imageStyle.seriesStyle}
                                key={value.patientID}
                            >
                                {}
                                <PatientView {...value} />
                            </Grid>
                        )}
                    </Grid>
                </div>
            );
        // } else {
        //     return <div />;
        // }
    }

    componentWillUnmount() {
        this.props.deselectAllItems();
    }
}

function mapStateToProps(state: State): ConnectedState {
    return { patientList: Array.from(getPatients(state).values()) };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        deselectAllItems: () => dispatch(allItemsUnselected())
    };
}

export const PatientViewer = connect(mapStateToProps, mapDispatchToProps)(PatientViewerComponent);