import * as React from 'react';
import * as Redux from 'redux';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from './ImageView';
import {
    SeriesSelectedAction, seriesSelected,
    thumbnailBlownUp, ThumbnailBlownUpAction, Keys
} from '../actions/actions';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { imageStyle } from '../styles/ComponentsStyle';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
// import FontIcon from 'material-ui/Icon'

export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    src: string;
    imageID: string;
    studyID: string;
    uploadID: number;
}

export interface ConnectedDispatch {
    selectedSeries: (seriesID: string, keyPressed: Keys) => SeriesSelectedAction;
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
}

export interface ConnectedState {
    seriesSelected: boolean;

}
class SerieViewComponent extends React.Component<SeriesProps & ConnectedDispatch & ConnectedState, {}> {

    private timer = null;

    constructor(props) {
        super(props);
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.displayAlbum = this.displayAlbum.bind(this);
    }

    handleImageClick(event: MouseEvent) {
        let keyPressed: Keys = Keys.NONE;

        if (event.ctrlKey) {
            keyPressed = Keys.CTRL;
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(
            () => {
                console.log('clicked on ' + this.props.seriesID);
                this.props.selectedSeries(this.props.seriesID, keyPressed);
            },
            100
        );
    }

    handleDoubleClick() {
        clearTimeout(this.timer);
    }

    displayAlbum() {
    }

    getGalleryPath(): string {
        let uploaid: number = this.props.uploadID;
        let study: string = this.props.studyID;
        let series: string = this.props.seriesID;
        return `/gallery/${uploaid}/${study}/${series}`;
    }

    render() {
        let borderStyle;
        this.props.seriesSelected ? borderStyle = '3px solid LightSeaGreen' : borderStyle = '3px solid white';

        return (
            <div>

                <Card style={{ border: borderStyle }}>
                    <CardMedia>
                        <ImageViewComponent
                            imageName={this.props.src}
                            imageID={this.props.imageID}
                            handler={this.handleImageClick}
                            blowUp={this.props.blowUp}
                            handleDouble={this.handleDoubleClick}
                        />
                    </CardMedia>
                    <CardContent style={imageStyle.contentCenter}>
                        <Typography type="body2" component="p">
                            {this.props.seriesDescription}
                        </Typography>
                    </CardContent>
                    <Link to={this.getGalleryPath()}>
                        <a>
                            <img
                                src={require('../icons/icon1.png')}
                                style={{ float: 'right', marginBottom: '5', marginRight: '5' }}
                                onClick={this.displayAlbum}
                            />
                        </a>
                    </Link>
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state: State, props: SeriesProps): SeriesProps & ConnectedState {
    return {
        seriesID: props.seriesID,
        seriesDescription: props.seriesDescription,
        src: props.src,
        imageID: props.imageID,
        studyID: props.studyID,
        uploadID: props.uploadID,
        seriesSelected: state.ui.selections.series.indexOf(props.seriesID) !== -1
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        selectedSeries: (seriesID: string, keyPressed: Keys) => dispatch(seriesSelected(seriesID, keyPressed)),
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID))
    };
}

export const SerieView = connect(mapStateToProps, mapDispatchToProps)(SerieViewComponent);