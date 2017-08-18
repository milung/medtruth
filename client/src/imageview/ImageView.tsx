
import * as React from 'react';
import { imageStyle } from '../styles/ComponentsStyle';
import { ApiService } from '../api';
import { getThumbnailImageURL } from '../constants';
import { Keys } from '../actions/actions';

export interface OwnProps {
    imageNumber: number;
    imageID: string;
    isSelected: boolean;
}
export interface ImageProps {
    handleClick: (imageID: string, keyPressed: Keys) => void;
    blowUp: (imageID: string) => void;
    handleDouble: () => void;
}
export class ImageViewComponent extends React.Component<OwnProps & ImageProps, {}> {
    constructor(props) {
        super(props);

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        // this.getUrl = this.getUrl.bind(this);
    }

    componentDidMount() {
        let thumbnailURI = getThumbnailImageURL(this.props.imageID);
        let img = document.getElementById(this.props.imageNumber + '') as HTMLImageElement;
        if (img != null) {
            img.src = thumbnailURI;
        }
    }

    /*
    async getUrl(): Promise<void> {
        let thumbnailURI = getThumbnailImageURL(this.props.imageName);
        //let resImage = await ApiService.getImage(this.props.imageName + '_');
        let img = document.getElementById(this.props.imageID + '') as HTMLImageElement;
        if (img != null) {
            img.src = resImage === null ? '' : resImage.url;
        }
    }
    */

    clickHandler(event) {
        let keyPressed: Keys = Keys.NONE;

        if (event.ctrlKey) {
            keyPressed = Keys.CTRL;
        }

        this.props.handleClick(this.props.imageID, keyPressed);
    }

    handleDoubleClick() {
        this.props.handleDouble();
        console.log('double click!');
        this.props.blowUp(this.props.imageID);
    }

    // keyPressed(event) {
    //     console.log(event.keyCode);
    //     this.setState(Object.assign({}, this.state, { open: false }));
    // }

    render() {
        return (
            <img
                id={this.props.imageNumber + ''}
                style={imageStyle.img}
                onClick={this.clickHandler}
                onDoubleClick={this.handleDoubleClick}
            />
        );
    }
}