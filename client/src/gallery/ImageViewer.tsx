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
import Paper from 'material-ui/Paper';

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
        await this.receiveImages(this.props.uploadID, this.props.studyID, this.props.seriesID);
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
            }
            this.setState({ imageList: tempImages });
        } else {
            tempImages = [];
            this.setState({ imageList: [] });
        }
        this.setState({ wait: false });
    }

    render() {
        if (!this.state.wait) {
        return (            
            <div style={{marginLeft: 10, marginBottom: 10, marginRight: 10}}>
                <Paper style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 30}}>
                <Grid container={true} gutter={16}>
                    {this.state.imageList.map(value =>
                        <Grid item="false" xs={6} sm={3} md={2} style={imageStyle.seriesStyle} key={value.imageID}>
                            <Card style={{paddingLeft: 3, paddingRight: 3,paddingTop: 3, paddingBottom: 10}}>
                                <ImageViewComponent {...value} />
                            </Card>
                        </Grid>
                    )
                    }
                </Grid>
                </Paper>
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