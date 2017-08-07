import * as React from 'react';
import * as Redux from 'redux';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from "./ImageView";
import { SeriesSelectedAction, seriesSelected, thumbnailBlownUp, ThumbnailBlownUpAction } from "../actions/actions";
import { connect } from "react-redux";
import { State } from "../app/store";
import { imageStyle } from '../styles/ComponentsStyle';
import Icon from 'material-ui/Icon';
//import FontIcon from 'material-ui/Icon'


export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    src: string;
    imageID: string;
}

export interface ConnectedDispatch {
    selectedSeries: (seriesID: string) => SeriesSelectedAction;
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
}

export interface ConnectedState {
    seriesSelected: boolean;

}
class SerieViewComponent extends React.Component<SeriesProps & ConnectedDispatch & ConnectedState, {}> {
    constructor(props) {
        super(props);
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.displayAlbum = this.displayAlbum.bind(this);
    }

    private timer = null;

    handleImageClick() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log("clicked on " + this.props.seriesID);
            this.props.selectedSeries(this.props.seriesID);
        }, 100);
    }

    handleDoubleClick() {
        clearTimeout(this.timer);
    }

    displayAlbum(){
        alert('Iam in gallery');
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
                            handler={this.handleImageClick.bind(this)}
                            blowUp={this.props.blowUp}
                            handleDouble={this.handleDoubleClick}
                        />
                    </CardMedia>
                    <CardContent style={imageStyle.contentCenter}>
                        <Typography type="body2" component="p">
                            {this.props.seriesDescription}
                        </Typography>
                    </CardContent>
                    <a><img src={require('../icons/icon1.png')} style={{ float: "right", marginBottom:"5", marginRight:"5"}} onClick={this.displayAlbum}/></a>
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
        seriesSelected: state.ui.selections.series.indexOf(props.seriesID) !== -1
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        selectedSeries: (seriesID: string) => dispatch(seriesSelected(seriesID)),
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID))

    }
}

export const SerieView = connect(mapStateToProps, mapDispatchToProps)(SerieViewComponent);