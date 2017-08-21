import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageView } from '../imageview/ImageView';
import { ApiService } from '../api';
import { connect } from 'react-redux';
import { State } from '../app/store';
import * as Redux from 'redux';
import Paper from 'material-ui/Paper';

import {
    ThumbnailBlownUpAction, thumbnailBlownUp,
    SeriesSelectedAction, Keys, selectedImage, ImageSelectedAction, ImagesAllUnselectedAction,
    imagesAllUnselected, AllItemsUnselectedAction, allItemsUnselected
} from '../actions/actions';

import { PatientProps, convertDate } from '../imageview/PatientView';
import { Link } from 'react-router-dom';
import { ImageEntity, PatientEntity, StudyEntity, SeriesEntity } from "../reducers/EntitiesReducer";
import { getImagesWhereSeriesId, getStudiesWhereId, getPatientsWhereId, getSeriesesWhereId } from "../selectors/selectors";
import { BackButton } from "./BackButton";

interface OwnProps {
    match: any;
    history: any;
}
interface ConnectedState {
    imageList: ImageEntity[];
    patients: PatientEntity[];
    studies: StudyEntity[];
    series: SeriesEntity[];

}

interface ConnectedDispatch {
    deselectAllItems: () => AllItemsUnselectedAction;
}

/**
 * Gallery component
 */
class ImageViewerComponent extends React.Component<OwnProps & ConnectedDispatch & ConnectedState, {}> {
    private timer = null;

    private patientName: string;
    private seriesDescription: string;
    private uploadDate: number;

    constructor(props) {
        super(props);
        this.state = {
            wait: false,
            imageList: []
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.selectedImages !== this.props.selectedImages) {
    //         let imageList: ImageEntity[] = [...this.props.imageList];
    //         for (let image in imageList) {
    //             if (nextProps.selectedImages.indexOf(imageList[image].imageID) !== -1) {
    //                 // image is now selected

    //                 if (!imageList[image].isSelected) {
    //                     // image was not selected

    //                     imageList[image] = { ...imageList[image] };
    //                     imageList[image].isSelected = true;
    //                 }
    //             } else {
    //                 // image is now not selected 

    //                 if (imageList[image].isSelected) {
    //                     // image was selected

    //                     imageList[image] = { ...imageList[image] };
    //                     imageList[image].isSelected = false;
    //                 }
    //             }
    //         }
    //         this.setState({ imageList });
    //     }
    // }

    // TODO get images from state

    getImageBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
        console.log('IMAGE VIEWER RENDERING');
        console.log('image list', this.props.imageList);
        return (
            <div style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
                <Grid item="true" xs={1} sm={1} md={1} lg={1} xl={1}>
                    <BackButton history={this.props.history} />
                </Grid>
                <Typography type="display1" component="p" style={{ margin: 20 }}>
                    List of images
                        </Typography>
                <Grid item={true} xs={12} sm={12} md={12} style={imageStyle.seriesStyle} >
                    <Typography type="body1">Name: <b>{this.props.patients[0].patientName} </b></Typography>
                    {/* <Typography type="body1">Birthday: <b>{convertDate(this.props.patients[0].patientBirthday)}</b></Typography> */}
                    <Typography type="body1">Study description: <b>{this.props.studies[0].studyDescription}</b></Typography>
                    <Typography type="body1">Series description: <b>{this.props.series[0].seriesDescription}</b></Typography>
                </Grid>
                <Grid container={true} gutter={16} style={imageStyle.ImageViewGrid} >
                    {this.props.imageList.map((value, index) =>
                        <Grid
                            item="false"
                            xs={6}
                            sm={3}
                            md={2}
                            style={imageStyle.seriesStyle}
                            key={index}
                        >
                            <ImageView {...value} />
                        </Grid>
                    )}
                </Grid>
                {/* </Paper> */}
            </div>
        );
    }

    componentWillUnmount() {
        this.props.deselectAllItems();
    }
}

function mapStateToProps(state: State, props): ConnectedState {
    let seriesID = props.match.params.seriesID;
    let patientID = props.match.params.patientID;
    let studyID = props.match.params.studyID;

    return {
        patients: getPatientsWhereId(state, [patientID]),
        studies: getStudiesWhereId(state, [studyID]),
        series: getSeriesesWhereId(state, [seriesID]),
        imageList: getImagesWhereSeriesId(state, seriesID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        deselectAllItems: () => dispatch(allItemsUnselected())
    };
}

export const ImageViewer = connect(mapStateToProps, mapDispatchToProps)(ImageViewerComponent);