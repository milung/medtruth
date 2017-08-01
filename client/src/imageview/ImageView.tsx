
import * as React from 'react';
import * as Redux from 'redux';
import imageStyle from '../styles/ComponentsStyle';
import { ApiService } from '../api';
import { ImageSelectedAction, selectedImage } from "../actions/actions";
import { connect } from "react-redux";
import { State } from "../app/store";


interface ConnectedDispatch {
    selectedImage: (imageName: string) => ImageSelectedAction;
}

interface OwnProps{
    imageID: string;
    imageName: string;
}

interface ConnectedState {
    imageSelected: boolean;
}

class ImageViewComponent extends React.Component<ConnectedDispatch & OwnProps & ConnectedState, {}> {
    constructor(props) {
        super(props);
        this.getUrl = this.getUrl.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = { imageSelected: false };
    }

    componentWillMount() {
        this.getUrl();
    }

    async getUrl(): Promise<void> {
        let resImage = await ApiService.getImage(this.props.imageName);
        let img = document.getElementById(this.props.imageID) as HTMLImageElement;
        img.src = resImage === null ? "" : resImage.url;
    }

    handleClick() {
        console.log("blob ID", this.props.imageName);
        console.log("state before", this.props.imageSelected);
        this.props.selectedImage(this.props.imageName);
    }

    componentWillUpdate() {
        console.log("state right after", this.props.imageSelected);
        let borderStyle;
        this.props.imageSelected ? borderStyle = "3px solid LightSeaGreen" : borderStyle = "3px solid white";
        document.getElementById(this.props.imageID).parentElement.style.border = borderStyle;
        console.log("border style", borderStyle);
    }

    render() {
        return <img id={this.props.imageID} style={imageStyle.img} onClick={this.handleClick.bind(this)} />;
    }
}


function mapStateToProps(state: State, props: OwnProps): OwnProps & ConnectedState {
    //console.log('uploadid: ' + state.files.lastUploadID);
    return {
        imageID: props.imageID,
        imageName: props.imageName,
        imageSelected: state.ui.selections.images.has(props.imageName)
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ImageSelectedAction>): ConnectedDispatch {
    return {
        selectedImage: (imageName: string) =>
            dispatch(selectedImage(imageName)),
    };
}

export const ImageView = connect(mapStateToProps, mapDispatchToProps)(ImageViewComponent);