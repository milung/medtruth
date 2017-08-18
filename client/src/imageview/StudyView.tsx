import * as React from 'react';
import * as Redux from 'redux';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from './ImageView';
import {
    SeriesSelectedAction, seriesSelected,
    thumbnailBlownUp, ThumbnailBlownUpAction, Keys, StudiesSelectedAction
} from '../actions/actions';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { imageStyle } from '../styles/ComponentsStyle';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
//import { ArrayOfSeries } from "./SeriesViewer";

// import FontIcon from 'material-ui/Icon'

export interface StudiesProps {
    patientID: string;  // TODO REMOVE PATIENT ID
    studyID: string;
    studyDescription: string;
    //series: ArrayOfSeries;
}

interface OwnProps {
    match: any;
}

export interface ArrayOfStudies{
    listOfStudies:StudiesProps[];
}

export interface ConnectedDispatch {
    selectedStudies: (seriesID: string, keyPressed: Keys) => SeriesSelectedAction;
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
}

export interface ConnectedState {
    seriesSelected: boolean;
}
export class StudyViewComponent extends React.Component<OwnProps & StudiesProps & ConnectedDispatch & ConnectedState, StudiesProps> {

    private timer = null;

    constructor(props) {
        super(props);
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);    
    }

    handleImageClick(imageID: string, keyPressed: Keys) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            () => {
                console.log('clicked on ' + this.props.studyID);
                this.props.selectedStudies(this.props.studyID, keyPressed);
            },
            100
        );
    }

    handleDoubleClick() {
        clearTimeout(this.timer);
    }

    getSeriePath(): string {      
        ///patients/:patientID/studies/:studyID
        // let studyID = this.props.match.params.studyID; 
        // let patientID = this.props.match.params.patientID;
        // return `/patients/${patientID}/studies/${studyID}`;
        // TODO get patientID from redux
        return `/studies/${this.props.studyID}/${this.props.patientID}`;
    }

    render() {
        let borderStyle;
        this.props.seriesSelected ? borderStyle = '3px solid LightSeaGreen' : borderStyle = '3px solid white';
        console.log('path' + this.getSeriePath());
        return (
            <div >
                <Card style={{ border: borderStyle }}>                    
                    <CardContent style={imageStyle.contentCenter}>
                        <Typography type="title" component="p">
                            {this.props.studyID}
                        </Typography>
                        <Typography type="body2" component="p">
                            {this.props.studyDescription}
                        </Typography>
                    </CardContent>
                    <Link to={this.getSeriePath()}>
                        <a>
                            <img
                                src={require('../icons/icon1.png')}
                                style={{ float: 'right', marginBottom: '5', marginRight: '5' }}                               
                            />
                        </a>
                    </Link>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state: State, props: StudiesProps): StudiesProps & ConnectedState {
    return {
        // TODO REMOVE PATIENT ID
        patientID: props.patientID,
        studyID: props.studyID,
        studyDescription: props.studyDescription,   
        seriesSelected: state.ui.selections.series.indexOf(props.studyID) !== -1
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<StudiesSelectedAction>): ConnectedDispatch {
    return {
        selectedStudies: (seriesID: string, keyPressed: Keys) => dispatch(seriesSelected(seriesID, keyPressed)),
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID))
    };
}

export const StudyView = connect(mapStateToProps, mapDispatchToProps)(StudyViewComponent);