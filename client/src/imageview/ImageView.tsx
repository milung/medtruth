
/*
import * as React from 'react';
import { connect } from 'react-redux';
import { FileFormState } from '../fileform/FileFormReducer';
import * as cornerstone from 'cornerstone-core';


// tslint:disable-next-line:no-string-literal
global['$'] = require('jquery');

var config = {
    webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
        'decodeTask': {
            codecsPath: '/cornerstoneWADOImageLoaderCodecs.js'
        }
    }
};


// tslint:disable-next-line:no-string-literal
// cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

interface ConnectedProps {
    imageID: string;
    valid: boolean;
}

export class ImageViewComponent extends React.Component<ConnectedProps, {}> {
    divElement: HTMLDivElement;

    loadAndViewImage() {
        if (this.props.valid === false || this.props.imageID === '') {
            this.divElement.hidden = true;
            return;
        }

        this.divElement.hidden = false;

        var element = this.divElement;

        cornerstone.loadImage(this.props.imageID).then(function (image: {}) {
            let viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
        });
    }

    componentDidUpdate() {
        this.loadAndViewImage();
    }

    componentDidMount() {
        cornerstone.enable(this.divElement);
    }

    render() {
        return (
            <div
                ref={element => this.divElement = element}
                style={{ width: 512, height: 512, top: 0, left: 0 }}
            />
        );
    }
}


function mapStateToProps(state: FileFormState): ConnectedProps {
    return { valid: state.file.valid, imageID: state.file.imageId };
}


export const ImageView = connect(mapStateToProps, null)(ImageViewComponent);
*/