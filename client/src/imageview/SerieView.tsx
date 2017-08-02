import * as React from 'react';
import * as Redux from 'redux';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from "./ImageView";
import { SeriesSelectedAction, seriesSelected } from "../actions/actions";
import { connect } from "react-redux";
import { State } from "../app/store";

export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    src: string;
    imageID: string;
}

export interface ConnectedDispatch {
    selectedSeries: (seriesID: string) => SeriesSelectedAction;
}

export interface ConnectedState {
    seriesSelected: boolean;
}

class SerieViewComponent extends React.Component<SeriesProps & ConnectedDispatch & ConnectedState, {}> {
    constructor(props) {
        super(props);
        this.handleImageClick = this.handleImageClick.bind(this);
        console.log("seria sa vykreslila s propsami", this.props);
    }

    handleImageClick() {
        console.log("clicked on " + this.props.seriesID);
        this.props.selectedSeries(this.props.seriesID);
    }

    render() {
        let borderStyle;
        this.props.seriesSelected ? borderStyle = '3px solid LightSeaGreen' : borderStyle = '3px solid white';
         
        return (
            <div>
                <Card seriesID={this.props.seriesID} style={{border: borderStyle}}>
                    <CardMedia>
                        <ImageViewComponent 
                            imageName={this.props.src} 
                            imageID={this.props.imageID} 
                            handler={this.handleImageClick} 
                        />
                    </CardMedia>
                    <CardContent>
                        <Typography type="body2" component="p">
                            {this.props.seriesDescription}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
};

function mapStateToProps(state: State, props: SeriesProps): SeriesProps & ConnectedState {
    return {
        seriesID: props.seriesID,
        seriesDescription: props.seriesDescription,
        src: props.src,
        imageID: props.imageID,
        seriesSelected: state.ui.selections.series.has(props.seriesID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<SeriesSelectedAction>): ConnectedDispatch {
    return {
        selectedSeries: (seriesID: string) => dispatch(seriesSelected(seriesID)),
    }
}

export const SerieView = connect(mapStateToProps, mapDispatchToProps)(SerieViewComponent);