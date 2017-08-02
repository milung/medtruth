import * as React from 'react';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageViewComponent } from "./ImageView";

export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    src: string;
    imageID: string;
}

export class SerieView extends React.Component<SeriesProps, {}> {
    constructor(props: SeriesProps) {
        super(props);
        console.log("seria sa vykreslila");
        //this.handleImageClick = this.handleImageClick.bind(this);
    }

    handleImageClick() {
        console.log("just click");
    }

    render() {
        //<ImageViewComponent imageName={this.props.src} imageID={this.props.imageID} handler={this.handleImageClick.bind(this)}/>
                    
        return (
            <div>
                <Card style={{border: "3px solid LightSeaGreen"}}>
                    <CardMedia>
                        <ImageViewComponent imageName={this.props.src} imageID={this.props.imageID}  handler={this.handleImageClick.bind(this)}/>
                    </CardMedia>
                    <CardContent>
                        <Typography type="body2" component="p">
                            {this.props.seriesDescription}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
};

// function mapStateToProps(state: State, props: OwnProps): OwnProps & ConnectedState {
//     //console.log('uploadid: ' + state.files.lastUploadID);
//     return {
//         imageID: props.imageID,
//         imageName: props.imageName,
//         imageSelected: state.ui.selections.images.has(props.imageName)
//     }
// }

// function mapDispatchToProps(dispatch: Redux.Dispatch<ImageSelectedAction>): ConnectedDispatch {
//     return {
//         selectedImage: (imageName: string) =>
//             dispatch(selectedImage(imageName)),
//     };
// }

// export const ImageView = connect(mapStateToProps, mapDispatchToProps)(ImageViewComponent);