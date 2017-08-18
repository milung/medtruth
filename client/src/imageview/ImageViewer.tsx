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

import { PatientProps } from '../imageview/PatientView';
import { Link } from 'react-router-dom';
import { ImageEntity } from '../reducers/EntitiesReducer';
import { getImagesWhereSeriesId } from '../selectors/selectors';

interface OwnProps {
    match: any;
}
interface ConnectedState {
    imageList: ImageEntity[];
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

            <div style={imageStyle.imageViewerDiv}>

                <Paper style={imageStyle.imageViewerPaper}>

                    {/* <div style={{ marginBottom: 32, width: '100%'}}>  */}
                    <Grid container={true} gutter={16} >
                        <Grid item="true" xs={1} sm={1} md={1} lg={1} xl={1}>
                            <Link to={'/'} style={{ margin: 10 }}>
                                <img
                                    src={require('../icons/arrow_back_black_36x36.png')}
                                    // style={{ float: 'left', marginTop: '10', marginLeft: '10' }}
                                    style={{ float: 'left', width: 30, height: 30 }}
                                />
                            </Link>
                        </Grid>
                        <Grid item="true" xs={11} sm={11} md={11} lg={11} xl={11}>
                            <div style={{ marginTop: '5px' }}>
                                {this.uploadDate} /
                                    {this.patientName} /
                                    {this.seriesDescription}
                            </div>
                        </Grid>
                    </Grid>
                    {/* </div> */}

                    <Grid container={true} gutter={16} style={imageStyle.ImageViewGrid}>
                        {this.props.imageList.map(value =>
                            <Grid
                                item="false"
                                xs={6}
                                sm={3}
                                md={2}
                                style={imageStyle.seriesStyle}
                                key={value.imageID}
                            >
                                <ImageView {...value}/>
                            </Grid>
                        )
                        }
                    </Grid>
                </Paper>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.deselectAllItems();
    }
}

function mapStateToProps(state: State, props): ConnectedState {
    let seriesID = props.match.params.seriesID;

    return {
        imageList: getImagesWhereSeriesId(state, seriesID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        deselectAllItems: () => dispatch(allItemsUnselected())
    };
}

export const ImageViewer = connect(mapStateToProps, mapDispatchToProps)(ImageViewerComponent);