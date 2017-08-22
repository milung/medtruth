import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { SerieView, SeriesProps } from './SerieView';
import { ApiService } from '../api';
import Typography from 'material-ui/Typography';
import { SeriesEntity, PatientEntity, StudyEntity } from "../reducers/EntitiesReducer";
import { State } from "../app/store";
import { getSeriesesWhereStudyId, getPatientsWhereId, getStudiesWhereId } from "../selectors/selectors";
import { connect } from "react-redux";
import { AllItemsUnselectedAction, ActionType, allItemsUnselected } from "../actions/actions";
import * as Redux from 'redux';
import { BackButton } from "./BackButton";
import { convertDate } from "./PatientView";

// export interface ArrayOfSeries {
//     list: SeriesProps[];
//     patientID: string;
//     studyID: string;
// }

interface OwnProps {
    match: any;
    history: any;
}

interface ConnectedState {
    seriesList: SeriesEntity[];
    patients: PatientEntity[];
    studies: StudyEntity[];

}

interface ConnectedDispatch {
    deselectAllItems: () => AllItemsUnselectedAction;
}

export class SeriesViewerComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch, {}> {

    constructor(props) {
        super(props);
    }

    render() {

        console.log('patientID', this.props.match.params.patientID);
        console.log('studyID', this.props.match.params.studyID);

        return (
            <div style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
                <Grid item="true" xs={1} sm={1} md={1} lg={1} xl={1}>
                    <BackButton history={this.props.history} />
                </Grid>
                <Typography type="display1" component="p" style={{ margin: 20 }} >
                    List of series
                </Typography>

                <Grid container={true} gutter={16}>
                    <Grid item={true} xs={12} sm={12} md={12} style={imageStyle.seriesStyle} >
                       <Typography type="body1">Patient name: <b>{this.props.patients[0].patientName}</b></Typography>
                       {/* <Typography type="body1">Birthday: <b>{convertDate(this.props.patients[0].patientBirthday)}</b></Typography> */}
                       <Typography type="body1">Study description: <b>{this.props.studies[0].studyDescription}</b></Typography>
                    </Grid>
                    {console.log("series list", this.props.seriesList)}
                    {this.props.seriesList.map((value) =>
                        <Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} key={value.seriesID}>
                            <SerieView {...{ ...value, patientID: this.props.match.params.patientID }} />
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
    let studyID = props.match.params.studyID;
    let patientID = props.match.params.patientID;

    let IDs = [];
    IDs.push(patientID);

    return {
        seriesList: getSeriesesWhereStudyId(state, studyID),
        patients: getPatientsWhereId(state, IDs),
        studies: getStudiesWhereId(state, [studyID])
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        deselectAllItems: () => dispatch(allItemsUnselected())
    };
}

export const SeriesViewer = connect(mapStateToProps, mapDispatchToProps)(SeriesViewerComponent);