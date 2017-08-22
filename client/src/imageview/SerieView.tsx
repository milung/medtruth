import * as React from 'react';
import * as Redux from 'redux';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import {
    SeriesSelectedAction, seriesSelected,
    thumbnailBlownUp, ThumbnailBlownUpAction, Keys, ItemSelectedAction, itemSelected, ItemTypes, ActionType
} from '../actions/actions';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { imageStyle } from '../styles/ComponentsStyle';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import { ImageComponent } from './Image';
// import FontIcon from 'material-ui/Icon'

export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    thumbnailImageID: string;
    studyID: string;
    patientID: string;  // TODO delete
}

export interface ConnectedDispatch {
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
    selectItem: (itemId: string, keyPressed: Keys) => ItemSelectedAction;
}

export interface ConnectedState {
    isSelected: boolean;
}
class SerieViewComponent extends React.Component<SeriesProps & ConnectedDispatch & ConnectedState, {}> {

    private timer = null;

    constructor(props) {
        super(props);
        this.doubleClickHandler = this.doubleClickHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    }

    doubleClickHandler() {
        clearTimeout(this.timer);
        this.props.blowUp(this.props.thumbnailImageID);
    }

    getGalleryPath(): string {
        return `/${this.props.seriesID}/${this.props.patientID}/${this.props.studyID}`;
    }

    clickHandler(event) {
        let keyPressed: Keys = Keys.NONE;

        if (event.ctrlKey) {
            keyPressed = Keys.CTRL;
        }

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(
            () => {
                this.props.selectItem(this.props.seriesID, keyPressed);
            },
            100
        );
    }

    getBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
        return (
            <div >
                <Card
                    onClick={this.clickHandler}
                    style={{ border: this.getBorderStyle(this.props.isSelected) }}
                >
                    <CardMedia>
                        <ImageComponent
                            imageID={this.props.thumbnailImageID}
                            handleDoubleClick={this.doubleClickHandler}
                        />
                    </CardMedia>
                    <CardContent style={imageStyle.contentCenter}>
                        <Typography type="title" component="p">
                            {this.props.seriesID}
                        </Typography>
                        <Typography type="body2" component="p">
                            {this.props.seriesDescription}
                        </Typography>
                    </CardContent>
                    <Link to={this.getGalleryPath()} onClick={event => { event.stopPropagation(); }}>
                        <a>
                            <img
                                src={require('../icons/icon1.png')}
                                style={{ float: 'right', marginBottom: '5', marginRight: '5' }}
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
        thumbnailImageID: props.thumbnailImageID,
        studyID: props.studyID,
        patientID: props.patientID,
        isSelected: isSeriesSelected(state, props.seriesID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID)),
        selectItem: (itemId: string, keyPressed: Keys) => dispatch(itemSelected(ItemTypes.SERIES, itemId, keyPressed))
    };
}

export const SerieView = connect(mapStateToProps, mapDispatchToProps)(SerieViewComponent);

const isSeriesSelected = (state: State, seriesId: string): boolean => {
    return state.ui.selections.series.indexOf(seriesId) !== -1;
};