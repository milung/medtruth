
import * as React from 'react';
import imageStyle from '../styles/ComponentsStyle'
import { ApiService } from "../api";

interface ImageProps {
    imageId: string;
    imageName: string;
}

export class ImageView extends React.Component<ImageProps, {}> {

    constructor(props: ImageProps){
        super(props);
        this.getUrl = this.getUrl.bind(this);
    }

    componentWillMount(){
        this.getUrl();
    }

    async getUrl(): Promise<void> {
        let resImage = await ApiService.getImage(this.props.imageName);
        let img = document.getElementById(this.props.imageId) as HTMLImageElement;
        img.src = resImage.url;
    }
    
    render() {
        return <img id={this.props.imageId} style={imageStyle.img}/>;
    }
}




