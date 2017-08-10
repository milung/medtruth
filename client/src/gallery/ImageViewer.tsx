import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from "../imageview/ImageView";
import { ImageProps } from '../imageview/ImageView'
import { ApiService } from "../api";
import { connect } from "react-redux";
import { State } from "../app/store";
import * as Redux from 'redux';
import { ThumbnailBlownUpAction, thumbnailBlownUp, SeriesSelectedAction } from "../actions/actions";

interface GaleryProps {
    uploadID: number;
    studyID: string;
    seriesID: string;
}

interface ArrayOfImages {
    wait: boolean;
    imageList: ImageProps[];
}
interface ConnectedDispatch {
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
}
/**
 * Gallery component
 */
class ImageViewerComponent extends React.Component<GaleryProps & ConnectedDispatch, ArrayOfImages> {
    private timer = null;
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
        // console.log("componentDidMount uploadID: ", this.props.uploadID);
        // console.log("componentDidMount studyID: ", this.props.studyID);
        // console.log("componentDidMount seriesID: ", this.props.seriesID);
        // console.log("dostala som sa sem. Spustam receive Images");
        await this.receiveImages(this.props.uploadID, this.props.studyID, this.props.seriesID);
        // console.log("skoncila som receive images");
    }

    handleImageClick() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            () => {
                // console.log('clicked on ' + this.props.seriesID);
            },
            100
        );
    }

    handleDoubleClick() {
        clearTimeout(this.timer);
    }

    
    async receiveImages(uploadID: number, studyID: string, seriesID: string): Promise<void> {
        this.setState({ wait: true });
        // console.log("uploadID: ", uploadID);
        // console.log("studyID: ", studyID);
        // console.log("seriesID: ", seriesID);
        // console.log("typeOf: ", typeof(+uploadID));
        // console.log("typeOf: ", typeof(studyID));
        // console.log("typeOf: ", typeof(seriesID));
        let resData = await ApiService.getSeriesImages(+uploadID, studyID, seriesID);
        console.log('resData: ', resData);
        let tempImages = [];
        if (resData) {
            for (let data of resData) {
                let tempImg: ImageProps = {
                    imageID: data.imageNumber,
                    imageName: data.imageID,
                    handler: this.handleImageClick,
                    blowUp: this.props.blowUp,
                    handleDouble: this.handleDoubleClick
                };
                tempImages.push(tempImg);
                // console.log("ImageID", tempImg.imageID);
                // console.log("ImageName", tempImg.imageName);
            }
            this.setState({ imageList: tempImages });
        } else {
            tempImages = [];
            this.setState({ imageList: [] });
        }
        this.setState({ wait: false });
        // console.log("imageList", this.state.imageList);
    }

    render() {
        if (!this.state.wait) {
        return (            
            <div >
                <Grid container={true} gutter={16}>
                    {this.state.imageList.map(value =>
                        <Grid item="false" xs={12} sm={6} md={4} lg={3} xl={2} style={imageStyle.seriesStyle} key={value.imageID}>
                            <Card style={{padding: '10'}}>
                                <ImageViewComponent {...value} />
                            </Card>
                        </Grid>
                    )
                    }
                </Grid>
            </div>
        );
        }else {
            return <div />;
        }
    }
}

function mapStateToProps(state: State, props: GaleryProps): GaleryProps {
    return {        
        uploadID: props.uploadID,
        studyID: props.studyID,
        seriesID: props.seriesID,
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID))
    };
}

export const ImageViewer = connect(mapStateToProps, mapDispatchToProps)(ImageViewerComponent);