import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { SerieView, SeriesProps } from './SerieView';
import { ApiService } from '../api';
import Typography from 'material-ui/Typography';
import { SeriesEntity } from "../reducers/EntitiesReducer";
import { State } from "../app/store";
import { getSeriesesWhereStudyId } from "../selectors/selectors";
import { connect } from "react-redux";
import { BackButton } from "./BackButton";

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
}

export class SeriesViewerComponent extends React.Component<OwnProps & ConnectedState, {}> {

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
                    {console.log("series list", this.props.seriesList)}
                    {this.props.seriesList.map((value, index) =>
                        <Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} key={value.seriesID}>
                            <SerieView {...{ ...value, patientID: this.props.match.params.patientID, seriesNumber: index }} />
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }
}

function mapStateToProps(state: State, props): ConnectedState {
    let studyID = props.match.params.studyID;
    let patientID = props.match.params.patientID;

    return { seriesList: getSeriesesWhereStudyId(state, studyID) };
}

export const SeriesViewer = connect(mapStateToProps, null)(SeriesViewerComponent);