import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from '../imageview/ImageView';
import { ImageProps } from '../imageview/ImageView';
import { ApiService } from '../api';
import { connect } from 'react-redux';
import { State } from '../app/store';
import * as Redux from 'redux';
import Paper from 'material-ui/Paper';

import {
    ThumbnailBlownUpAction, thumbnailBlownUp,
    SeriesSelectedAction, Keys, selectedImage, ImageSelectedAction, ImagesAllUnselectedAction, imagesAllUnselected
} from '../actions/actions';

import { PatientProps } from '../imageview/PatientView';
import { Link } from 'react-router-dom';
import { ImageEntity } from "../reducers/EntitiesReducer";
import { getImagesWhereSeriesId } from "../selectors/selectors";
import { BackButton } from "./BackButton";

interface OwnProps {
    match: any;
    history: any;
}
interface ConnectedState {
    selectedImages: string[];
    imageList: ImageEntity[];
}

interface ConnectedDispatch {
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
    selectedImage: (imageID: string, keyPressedL: Keys) => ImageSelectedAction;
    deselectAllImages: () => ImagesAllUnselectedAction;
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
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedImages !== this.props.selectedImages) {
            let imageList: ImageEntity[] = [...this.props.imageList];
            for (let image in imageList) {
                if (nextProps.selectedImages.indexOf(imageList[image].imageID) !== -1) {
                    // image is now selected

                    if (!imageList[image].isSelected) {
                        // image was not selected

                        imageList[image] = { ...imageList[image] };
                        imageList[image].isSelected = true;
                    }
                } else {
                    // image is now not selected 

                    if (imageList[image].isSelected) {
                        // image was selected

                        imageList[image] = { ...imageList[image] };
                        imageList[image].isSelected = false;
                    }
                }
            }
            this.setState({ imageList });
        }
    }

    handleImageClick(imageID: string, keyPressed: Keys) {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            () => {
                console.log('clicked on ' + this.props.match.params.seriesID);
                this.props.selectedImage(imageID, keyPressed);
            },
            100
        );
    }

    handleDoubleClick() {
        clearTimeout(this.timer);
    }

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

                <Grid container={true} gutter={16} style={imageStyle.ImageViewGrid}>
                    {this.props.imageList.map((value, index) =>
                        <Grid
                            item="false"
                            xs={6}
                            sm={3}
                            md={2}
                            style={imageStyle.seriesStyle}
                            key={index}
                        >
                            <Card
                                style={{
                                    ...imageStyle.imageViewerCard,
                                    border: this.getImageBorderStyle(value.isSelected)
                                }}
                            >
                                <ImageViewComponent {...{
                                    ...value, handleClick: this.handleImageClick,
                                    handleDouble: this.handleDoubleClick, blowUp: this.props.blowUp,
                                    isSelected: false
                                }} />
                            </Card>
                        </Grid>
                    )}
                </Grid>
                {/* </Paper> */}
            </div>
        );
    }

    componentWillUnmount() {
        this.props.deselectAllImages();
    }
}

function mapStateToProps(state: State, props): ConnectedState {
    let seriesID = props.match.params.seriesID;

    return {
        selectedImages: state.ui.selections.images,
        imageList: getImagesWhereSeriesId(state, seriesID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID)),
        selectedImage: (imageID: string, keyPressed: Keys) => dispatch(selectedImage(imageID, keyPressed)),
        deselectAllImages: () => dispatch(imagesAllUnselected())
    };
}

export const ImageViewer = connect(mapStateToProps, mapDispatchToProps)(ImageViewerComponent);