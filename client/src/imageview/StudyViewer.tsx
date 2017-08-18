import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { SerieView, SeriesProps } from './SerieView';
//import { ArrayOfSeries } from './SeriesViewer';
import { StudyViewComponent, StudiesProps, StudyView } from './StudyView';
import { ApiService } from '../api';
import Typography from 'material-ui/Typography';
import { StudyEntity, PatientEntity } from "../reducers/EntitiesReducer";
import { connect } from "react-redux";
import { getStudies, getStudiesWherePatientId, getPatientsWhereId } from "../selectors/selectors";
import { State } from "../app/store";
import { BackButton } from "./BackButton";

interface OwnProps {
    match: any;
    history: any;
}

interface ConnectedState {
    studiesList: StudyEntity[],
    patients: PatientEntity[],
}



export class StudyViewerComponent extends React.Component<OwnProps & ConnectedState, {}> {

    constructor() {
        super();
    }

    render() {
        console.log('render');
        console.log('render studies list', this.props.studiesList);
        return (
            <div style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
                <Grid item="true" xs={1} sm={1} md={1} lg={1} xl={1}>
                    <BackButton history={this.props.history} />
                </Grid>
                <Typography type="display1" component="p" style={{ margin: 20 }}>
                    List of studies
                </Typography>

                <Grid container={true} gutter={16}>
                    <Grid item={true} xs={12} sm={12} md={12} style={imageStyle.seriesStyle} >                     
                        <Typography type="body1"  >  Name:<b>{this.props.patients[0].patientName}</b></Typography>                      
                        <Typography type="body1" >   Birthday:<b>{this.props.patients[0].patientBirthday}</b></Typography>
                    </Grid>
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
}

function mapStateToProps(state: State, props): ConnectedState {
    let patientID = props.match.params.patientID;
    let IDs = [];
    IDs.push(patientID);


    return {
        studiesList: getStudiesWherePatientId(state, patientID),
        patients: getPatientsWhereId(state, IDs),
    };
}

export const StudyViewer = connect(mapStateToProps, null)(StudyViewerComponent);