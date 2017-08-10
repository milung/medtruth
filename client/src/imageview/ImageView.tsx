
import * as React from 'react';
import { imageStyle } from '../styles/ComponentsStyle';
import { ApiService } from '../api';

export interface ImageProps {
    imageID: number;
    imageName: string;
    handler: (event: {}) => void;
    blowUp: (imageID: string) => void;
    handleDouble: () => void;
}
export class ImageViewComponent extends React.Component<ImageProps, {}> {
    constructor(props) {
        super(props);

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.state = { imageSelected: false };
    }

    componentDidMount() {
        this.getUrl();
    }

    async getUrl(): Promise<void> {
        let resImage = await ApiService.getImage(this.props.imageName + '_');
        let img = document.getElementById(this.props.imageID + '') as HTMLImageElement;
        if (img != null) {
            img.src = resImage === null ? '' : resImage.url;
        }
    }

    handleDoubleClick() {
        this.props.handleDouble();
        console.log('double click!');
        this.props.blowUp(this.props.imageName);
    }

    keyPressed(event) {
        console.log(event.keyCode);
        this.setState(Object.assign({}, this.state, { open: false }));
    }

    render() {
        return (
            <img
                id={this.props.imageID + ''}
                style={imageStyle.img}
                onClick={this.props.handler}
                onDoubleClick={this.handleDoubleClick}
            />
        );
    }
}