
import * as React from 'react';
import imageStyle from '../styles/ComponentsStyle';
import { ApiService } from '../api';

interface ImageProps {
    imageID: string;
    imageName: string;
}

interface ImageState {
    imageSelected: boolean;
}

export class ImageView extends React.Component<ImageProps, ImageState> {
    constructor(props: ImageProps) {
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
        console.log("state before", this.state.imageSelected);
        this.setState({ imageSelected: !this.state.imageSelected }, () => {
            console.log("state right after", this.state.imageSelected);
            let borderStyle;
            this.state.imageSelected ? borderStyle = "3px solid LightSeaGreen" : borderStyle = "3px solid white";
            document.getElementById(this.props.imageID).parentElement.style.border = borderStyle;
            console.log("border style", borderStyle);
        });
    }

    render() {
        return <img id={this.props.imageID} style={imageStyle.img} onClick={this.handleClick.bind(this)} />;
    }
}
