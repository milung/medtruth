
import * as React from 'react';
import { imageStyle } from '../styles/ComponentsStyle';
import { ApiService } from '../api';
import {getThumbnailImageURL} from '../constants';
import { Keys } from '../actions/actions';

export interface ImageProps {
    imageID: number;
    imageName: string;
    isSelected: boolean;
    handleClick: (imageID: string, keyPressed: Keys) => void;
    blowUp: (imageID: string) => void;
    handleDouble: () => void;
}
export class ImageViewComponent extends React.Component<ImageProps, {}> {
    constructor(props) {
        super(props);

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        //this.getUrl = this.getUrl.bind(this);
    }

    componentDidMount() {
        let thumbnailURI = getThumbnailImageURL(this.props.imageName);
        let img = document.getElementById(this.props.imageID + '') as HTMLImageElement;
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

        this.props.handleClick(this.props.imageName, keyPressed);
    }

    handleDoubleClick() {
        this.props.handleDouble();
        console.log('double click!');
        this.props.blowUp(this.props.imageName);
    }

    // keyPressed(event) {
    //     console.log(event.keyCode);
    //     this.setState(Object.assign({}, this.state, { open: false }));
    // }


    render() {
        let borderStyle;
      
      
this.props.isSelected ? borderStyle = '3px solid LightSeaGreen' : borderStyle = '3px solid white';

        return (
            <img
                id={this.props.imageID + ''}
                style={{...imageStyle.img, border: borderStyle}}
                onClick={this.clickHandler}
                onDoubleClick={this.handleDoubleClick}
            />
        );
    }
}