
import * as React from 'react';
import imageStyle from '../styles/ComponentsStyle';
import { ApiService } from "../api";

interface ImageProps{
    imageID: string;
    imageName: string;
    handler: (...args: any[]) => void;
}
export class ImageViewComponent extends React.Component<ImageProps, {}> {
    constructor(props) {
        super(props);
        console.log("image sa vykreslil");
        console.log(this.props);
        
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.state = { imageSelected: false };
    }

    componentWillMount() {
        this.getUrl();
    }

    async getUrl(): Promise<void> {
        let resImage = await ApiService.getImage(this.props.imageName+"_");
        let img = document.getElementById(this.props.imageID) as HTMLImageElement;
        img.src = resImage === null ? "" : resImage.url;
    }

    handleDoubleClick() {
        console.log("double click!");
    }

    render() {
        return <img id={this.props.imageID} style={imageStyle.img} onClick={this.props.handler} onDoubleClick={this.handleDoubleClick.bind(this)}/>;
    }
}