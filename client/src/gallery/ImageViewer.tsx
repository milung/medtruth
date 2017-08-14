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

interface GaleryProps {
    uploadID: number;
    studyID: string;
    seriesID: string;
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
class ImageViewerComponent extends React.Component<GaleryProps & ConnectedDispatch & ConnectedState, ArrayOfImages> {
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
        await this.receiveImages(this.props.uploadID, this.props.studyID, this.props.seriesID);
        await this.receiveData(this.props.uploadID);
    }

    componentWillReceiveProps(nextProps: GaleryProps & ConnectedState) {
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

    async receiveData(uploadID: number): Promise<void> {
        let patId = 10;

        this.setState({ wait: true });

        let resData = await ApiService.getData(uploadID);

        console.log(' data', resData);
        let patients = [];

        for (let patient of resData.studies) {
            // let tempSeries = [];

            for (let tmpSerie of patient.series) {
                let serie = {
                    seriesID: tmpSerie.seriesID,
                    seriesDescription: tmpSerie.seriesDescription,
                    studyID: patient.studyID,
                    uploadID: resData.uploadID
                };
                if (serie.seriesID === this.props.seriesID) {
                    this.seriesDescription = serie.seriesDescription;
                }
            }
            let tempPatint = {
                //  patientId: patId,
                patientName: patient.patientName,
                dateOfBirth: patient.patientBirthday,
                studyDescription: patient.studyDescription,
                //  series: tempSeries
            };
            this.patientName = tempPatint.patientName;
        }
        this.uploadDate = resData.uploadDate;
        this.setState({ wait: false });

    }

    async receiveImages(uploadID: number, studyID: string, seriesID: string): Promise<void> {
        this.setState({ wait: true });

        let resData = await ApiService.getSeriesImages(+uploadID, studyID, seriesID);
        console.log('resData: ', resData);
        let tempImages = [];
        if (resData) {
            for (let data of resData) {
                let tempImg: ImageProps = {
                    imageID: data.imageNumber,
                    imageName: data.imageID,
                    handleClick: this.handleImageClick,
                    blowUp: this.props.blowUp,
                    handleDouble: this.handleDoubleClick,
                    isSelected: false
                };
                tempImages.push(tempImg);
            }
            this.setState({ imageList: tempImages });
        } else {
            tempImages = [];
            this.setState({ imageList: [] });
        }
        this.setState({ wait: false });
    }

    getImageBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
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

function mapStateToProps(state: State, props: GaleryProps): GaleryProps & ConnectedState {
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