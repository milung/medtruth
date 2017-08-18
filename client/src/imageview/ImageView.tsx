
import * as React from 'react';
import { imageStyle } from '../styles/ComponentsStyle';
import { ApiService } from '../api';
import { getThumbnailImageURL } from '../constants';
import {
    Keys, ThumbnailBlownUpAction, ItemSelectedAction,
    thumbnailBlownUp, itemSelected, ItemTypes, ActionType
} from '../actions/actions';
import { connect } from 'react-redux';
import Card from 'material-ui/Card';
import { ImageComponent } from './Image';
import * as Redux from 'redux';
import { State } from '../app/store';

export interface OwnProps {
    imageNumber: number;
    imageID: string;
}

export interface ConnectedDispatch {
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
    selectItem: (itemId: string, keyPressed: Keys) => ItemSelectedAction;
}

export interface ConnectedState {
    isSelected: boolean;
}

export class ImageViewComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch, {}> {
    private timer = null;
    constructor(props) {
        super(props);

        this.doubleClickHandler = this.doubleClickHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        // this.getUrl = this.getUrl.bind(this);
    }

    componentDidMount() {
        let thumbnailURI = getThumbnailImageURL(this.props.imageID);
        console.log('imageView got thumbnail uri' + thumbnailURI);
        let img = document.getElementById(this.props.imageID) as HTMLImageElement;
        if (img != null) {
            img.src = thumbnailURI;
        }
        console.log('image set src ' + img.src);
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

    doubleClickHandler() {
        clearTimeout(this.timer);
        this.props.blowUp(this.props.imageID);
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
                this.props.selectItem(this.props.imageID, keyPressed);
            },
            100
        );
    }

    // handleDoubleClick() {
    //     this.props.handleDouble();
    //     console.log('double click!');
    //     this.props.blowUp(this.props.imageID);
    // }

    // handleImageClick(imageID: string, keyPressed: Keys) {
    //     if (this.timer) {
    //         clearTimeout(this.timer);
    //     }
    //     this.timer = setTimeout(
    //         () => {
    //             console.log('clicked on ' + this.props.match.params.seriesID);
    //             this.props.selectedImage(imageID, keyPressed);
    //         },
    //         100
    //     );
    // }

    getBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
        return (
            <Card
                style={{
                    ...imageStyle.imageViewerCard,
                    border: this.getBorderStyle(this.props.isSelected)
                }}
                onClick={this.clickHandler}
                
            >
                <ImageComponent imageID={this.props.imageID} handleDoubleClick={this.doubleClickHandler} />

            </Card>

        );
    }
}

function mapStateToProps(state: State, props): OwnProps & ConnectedState {
    return {
        imageID: props.imageID,
        imageNumber: props.imageNumber,
        isSelected: isImageSelected(state, props.imageID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID)),
        selectItem: (itemId: string, keyPressed: Keys) => dispatch(itemSelected(ItemTypes.IMAGE, itemId, keyPressed))
    };
}

export const ImageView = connect(mapStateToProps, mapDispatchToProps)(ImageViewComponent);

const isImageSelected = (state: State, imageId: string) => {
    return state.ui.selections.images.indexOf(imageId) !== -1;
};