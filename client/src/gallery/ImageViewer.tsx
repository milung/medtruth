import * as React from 'react';
import * as Redux from 'redux';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { ApiService } from '../api';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { UploadJSON, UploadDataDownloadedAction, uploadDataDowloaded } from '../actions/actions';
import { ImageViewComponent } from './ImageView';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

interface ConnectedState {
    uploadID: number;
}

interface ConnectedDispatch {
    uploadedDataDownloaded: (upload: UploadJSON) => UploadDataDownloadedAction;
}

interface ImageProps {
    imageID: string;
    imageName: string;
}

interface ArrayOfImages {
    list: ImageProps[];
}

let MOCimages = [];

for (let i = 0; i <= 50; i++) {
    let image = {
        imageID: i + '',
        imageName: '2'
    };
    MOCimages.push(image);
}

export class ImageViewerComponent extends React.Component<{}, {}> {

    constructor() {
        super();
        this.state = {
            wait: false,
            // patientList: []
        };
    }

    // componentWillUpdate(nextProps, nextState) {
    //     if (nextProps.uploadID !== this.props.uploadID) {
    //         this.receiveData(nextProps.uploadID);
    //     }
    // }

    // componentDidMount() {
    //     this.receiveData(this.props.uploadID);
    // }

    // async receiveData(uploadID): Promise<void> {
    //     let patId = 10;
    //     let imageId = 10;

    //     this.setState({ wait: true });

    //     let resData = await ApiService.getData(uploadID/*12345*/);
    //     this.props.uploadedDataDownloaded(resData);
    //     console.log('got data', resData);
    //     let patients = [];

    //     for (let patient of resData.studies) {
    //         let tempSeries = [];

    //         for (let tmpSerie of patient.series) {
    //             let serie = {
    //                 seriesID: tmpSerie.seriesID,
    //                 seriesDescription: tmpSerie.seriesDescription,
    //                 src: tmpSerie.thumbnailImageID,
    //                 imageID: imageId
    //             };
    //             tempSeries.push(serie);
    //             imageId++;
    //         }

    //         };

    //         patId++;
    //     }

    render() {

        return (
            <div >
                <Grid container={true} gutter={16}>
                    {MOCimages.map(value =>
                        <Grid item="false" xs={12} sm={6} md={4} lg={3} xl={2} style={imageStyle.seriesStyle} >
                            <Card>
                                <ImageViewComponent {...value} />
                            </Card>
                        </Grid>

                    )
                    }
                </Grid>
            </div>
        );
    }
}