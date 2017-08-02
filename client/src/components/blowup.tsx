
import * as React from 'react';
import * as Redux from 'redux';
import IconButton from 'material-ui/IconButton';
import Cancel from 'material-ui/svg-icons/cancel';
import imageStyle from '../styles/ComponentsStyle';
import Paper from 'material-ui/Paper';
import { connect } from "react-redux";
import { thumbnailBlownDown, ThumbnailBlownDownAction } from "../actions/actions";

interface OwnProps {
}

interface OwnState {

}

interface ConnectedDispatch {
    blowDownImage : () => void;
}

export class BlowUpComponent extends React.Component<OwnProps & ConnectedDispatch, OwnState>{
    constructor() {
        super();
    }

    onExitClick() {
        console.log("exiting");
        this.props.blowDownImage();
    }

    render() {
        return (
            <div style={imageStyle.wrapper}>
                <Paper elevation={10} style={imageStyle.blowUpDiv}>
                    <IconButton style={imageStyle.iconButtonStyle} onClick={this.onExitClick.bind(this)}>
                        <IconButton>
                            <Cancel />
                        </IconButton>
                    </IconButton>

                    <img style={imageStyle.image} src="https://www.w3schools.com/css/img_fjords.jpg" />

                </Paper>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ThumbnailBlownDownAction>): ConnectedDispatch {
    return {
        blowDownImage: () => dispatch(thumbnailBlownDown())

    }
}

export const BlowUp = connect(null, mapDispatchToProps)(BlowUpComponent);

