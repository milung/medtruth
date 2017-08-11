
import * as React from 'react';
import * as Redux from 'redux';
import IconButton from 'material-ui/IconButton';
import Cancel from 'material-ui/svg-icons/cancel';
import { imageStyle } from '../styles/ComponentsStyle';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { thumbnailBlownDown, ThumbnailBlownDownAction } from '../actions/actions';
import { State } from '../app/store';
import { ApiService } from '../api';
import { CircularProgress } from 'material-ui/Progress';
import {getFullImageURL} from '../constants';

interface OwnProps {

}

interface OwnState {
    imageURL: string;
}
interface ConnectedState {
    showBlowUp: boolean;
    imageID: string;
}

interface ConnectedDispatch {
    blowDownImage: () => void;
}

export class BlowUpComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch, OwnState> {
    constructor() {
        super();
        this.state = { imageURL: '' };
        //this.setImageURL = this.setImageURL.bind(this);
        this.myOnKeyDown = this.myOnKeyDown.bind(this);
        this.onExitClick = this.onExitClick.bind(this);
    }

    onExitClick() {
        this.setState(Object.assign({}, this.state, { imageURL: ''}));
        this.props.blowDownImage();
    }

    myOnKeyDown(event: KeyboardEvent) {
        if (this.props.showBlowUp) {
            if (event.keyCode === 27) {
                this.onExitClick();
            }
        }
    }

    componentWillMount() {
        window.addEventListener('keydown', this.myOnKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.myOnKeyDown);
    }

    render() {
        let style = Object.assign({}, imageStyle.backgroundDiv);
        this.props.showBlowUp ? style.display = 'block' : style.display = 'none';
        let image = this.props.showBlowUp ? 
        <img style={imageStyle.image} src={getFullImageURL(this.props.imageID)} /> :
        undefined;

        return (
            <div style={style}>
                <div style={imageStyle.wrapper}>
                    <Paper elevation={10} style={imageStyle.blowUpDiv}>
                        <IconButton style={imageStyle.iconButtonStyle} onClick={this.onExitClick}>
                            <IconButton>
                                <Cancel />
                            </IconButton>
                        </IconButton>
                        {image}
                    </Paper>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        showBlowUp: state.ui.isBlownUpShowed,
        imageID: state.ui.blownUpThumbnailId
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ThumbnailBlownDownAction>): ConnectedDispatch {
    return {
        blowDownImage: () => dispatch(thumbnailBlownDown())
    };
}

export const BlowUp = connect(mapStateToProps, mapDispatchToProps)(BlowUpComponent);