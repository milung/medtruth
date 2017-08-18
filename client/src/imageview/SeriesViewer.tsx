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
import { AllItemsUnselectedAction, ActionType, allItemsUnselected } from "../actions/actions";
import * as Redux from 'redux';

// export interface ArrayOfSeries {
//     list: SeriesProps[];
//     patientID: string;
//     studyID: string;
// }

interface OwnProps {
    match: any;
}

interface ConnectedState {
    seriesList: SeriesEntity[];
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
              
                <Typography type="display1" component="p" style={{ margin: 20 }} >
                    List of series
                </Typography>
               
                <Grid container={true} gutter={16}>
                    {this.props.seriesList.map(value =>
                        <Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} key={value.seriesID}>
                            <SerieView {...{ ...value, patientID: this.props.match.params.patientID}} />
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

    return { seriesList: getSeriesesWhereStudyId(state, studyID) };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        deselectAllItems: () => dispatch(allItemsUnselected())
    };
}

export const SeriesViewer = connect(mapStateToProps, mapDispatchToProps)(SeriesViewerComponent);