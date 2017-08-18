import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { SerieView, SeriesProps } from './SerieView';
//import { ArrayOfSeries } from './SeriesViewer';
import { StudyViewComponent, StudiesProps, StudyView } from './StudyView';
import { ApiService } from '../api';
import Typography from 'material-ui/Typography';
import { StudyEntity } from "../reducers/EntitiesReducer";
import { connect } from "react-redux";
import { getStudies, getStudiesWherePatientId } from "../selectors/selectors";
import { State } from "../app/store";
import { AllItemsUnselectedAction, ActionType, allItemsUnselected } from "../actions/actions";
import * as Redux from 'redux';

// studyOne={
//     studyID:"prva",
//     studyDescription: "desciptions",
//     series: null,

// };
// studiesData.push(studyOne);

interface OwnProps {
    match: any;
}

interface ConnectedState {
    studiesList: StudyEntity[];
}

interface ConnectedDispatch {
    deselectAllItems: () => AllItemsUnselectedAction;
}

export class StudyViewerComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch, {}> {

    constructor() {
        super();
        //studiesData = props.listOfStudies;
    }

    // async componentDidMount() {
    //     await this.receiveData(this.props.match.params.patientID);
    // }

    // patientID: patient.patientID,
    // patientName: patient.patientName,
    // dateOfBirth: patient.dateOfBirth,   
    // async receiveData(patientID: string): Promise<void> {

    //     this.setState({ wait: true });

    //     let resData = await ApiService.getData(12345);

    //     // this.props.uploadedDataDownloaded(resData);
    //     console.log('got data', resData);
    //     let tmpStudies = [];

    //     for (let patient of resData.listOfPatients) {
    //         // console.log("len ist of patients",resData.listOfPatients.length)
    //         console.log('patient id' + typeof (patient.patientID) + ' ' + patient.patientID);
    //         console.log('patient id match' + this.props.match.params.patientID + ' ' + this.props.match.params.patientID);

    //         if (patient.patientID == this.props.match.params.patientID) {
    //             console.log('patient ' + this.props.match.params.patientID + ' found');
    //             console.log('patient studies', patient.studies);
    //             for (let tmpStudy of patient.studies) {
    //                 //  console.log("tmpStudy",tmpStudy)
    //                 let study: StudiesProps = {
    //                     // TODO REMOVE PATIENT ID
    //                     patientID: this.props.match.params.patientID,
    //                     studyID: tmpStudy.studyID,
    //                     studyDescription: tmpStudy.studyDescription,
    //                     series: null,
    //                 };
    //                 tmpStudies.push(study);
    //             }
    //         }
    //         console.log('studies', tmpStudies);
    //     }
    //     this.studiesList = tmpStudies;
    //     console.log('studies list', this.studiesList);
    //     this.setState({ wait: false });
    // }

    render() {
        console.log('render');
        console.log('render studies list', this.props.studiesList);
        return (
            <div style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
                <Typography type="display1" component="p" style={{ margin: 20 }}>
                    List of studies
                </Typography>
                <Grid container={true} gutter={16}>
                    {console.log("ID pacienta " + this.props.match.params.patientID)}
                    {this.props.studiesList.map(value =>
                        //<Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} //key={value.seriesID}>
                        <Grid item={true} xs={12} sm={12} md={12} style={imageStyle.seriesStyle} >
                            <StudyView {...value} />
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.deselectAllItems();
    }
}

function mapStateToProps(state: State, props): ConnectedState {
    let patientID = props.match.params.patientID;
    return { studiesList: getStudiesWherePatientId(state, patientID) };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        deselectAllItems: () => dispatch(allItemsUnselected())
    };
}

export const StudyViewer = connect(mapStateToProps, mapDispatchToProps)(StudyViewerComponent);