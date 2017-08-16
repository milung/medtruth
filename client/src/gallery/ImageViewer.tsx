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
// import {imageStyle} from '../styles/ComponentsStyle'

interface GalleryProps {
    uploadID: number;
    studyID: string;
    seriesID: string;
}

interface OwnProps {
    match: any;
}
interface ConnectedState {
    selectedImages: string[];
}

interface ArrayOfImages {
    wait: boolean;
    imageList: ImageProps[];
}

interface ConnectedDispatch {
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
    selectedImage: (imageID: string, keyPressedL: Keys) => ImageSelectedAction;
    deselectAllImages: () => ImagesAllUnselectedAction;
}

/**
 * Gallery component
 */
class ImageViewerComponent extends React.Component<OwnProps & GalleryProps & ConnectedDispatch & ConnectedState, ArrayOfImages> {
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

    async componentDidMount() {
        //await this.receiveImages(this.props.uploadID, this.props.studyID, this.props.seriesID);
        await this.receiveData();
    }

    componentWillReceiveProps(nextProps: GalleryProps & ConnectedState) {
        if (nextProps.selectedImages !== this.props.selectedImages) {
            let imageList: ImageProps[] = [...this.state.imageList];
            for (let image in imageList) {
                if (nextProps.selectedImages.indexOf(imageList[image].imageName) !== -1) {
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
                console.log('clicked on ' + this.props.seriesID);
                this.props.selectedImage(imageID, keyPressed);
            },
            100
        );
    }

    handleDoubleClick() {
        clearTimeout(this.timer);
    }

    async receiveData(): Promise<void> {
        this.setState({ wait: true });

        let resData = await ApiService.getData(12345);
        console.log('got data', resData);
        let tmpImages: ImageProps[] = [];

        console.log('match', this.props.match);
        console.log('match params', this.props.match.params);

        for (let patient of resData.listOfPatients) {
            console.log('patient id ' + this.props.match.params.patientID);

            if (patient.patientID == this.props.match.params.patientID) {
                console.log('patient ' + this.props.match.params.patientID + ' found');
                console.log('patient studies', patient.studies);
                for (let study of patient.studies) {
                    if (study.studyID == this.props.match.params.studyID) {
                        console.log('patient series', study.series);
                        for (let series of study.series) {
                            if (series.seriesID == this.props.match.params.seriesID) {
                                console.log('patient images', series.images);
                                for (let image of series.images) {
                                    tmpImages.push({
                                        imageID: image.imageNumber,
                                        imageName: image.imageID,
                                        handleClick: this.handleImageClick,
                                        blowUp: this.props.blowUp,
                                        handleDouble: this.handleDoubleClick,
                                        isSelected: false
                                    });
                                }
                            }
                        }
                    }
                }
                console.log('images', tmpImages);
            }
            this.setState({ imageList: tmpImages, wait: false });
        }
    }

    // TODO get images from state

    getImageBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
        console.log('IMAGE VIEWER RENDERING');
        console.log('image list', this.state.imageList);
        if (!this.state.wait) {
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
                            {this.state.imageList.map(value =>
                                <Grid
                                    item="false"
                                    xs={6}
                                    sm={3}
                                    md={2}
                                    style={imageStyle.seriesStyle}
                                    key={value.imageID}
                                >
                                    <Card
                                        style={{
                                            ...imageStyle.imageViewerCard,
                                            border: this.getImageBorderStyle(value.isSelected)
                                        }}
                                    >
                                        <ImageViewComponent {...{ ...value, isSelected: false }} />
                                    </Card>
                                </Grid>
                            )
                            }
                        </Grid>
                    </Paper>
                </div>
            );
        } else {
            return <div />;
        }
    }

    componentWillUnmount() {
        this.props.deselectAllImages();
    }
}

function mapStateToProps(state: State, props: GalleryProps): GalleryProps & ConnectedState {
    return {
        uploadID: props.uploadID,
        studyID: props.studyID,
        seriesID: props.seriesID,
        selectedImages: state.ui.selections.images
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