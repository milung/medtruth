
import * as React from 'react';
import { imageStyle } from '../styles/ComponentsStyle';
import { ApiService } from '../api';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

interface ImageProps {
    imageID: string;
    imageName: string;
}
export class ImageViewComponent extends React.Component<ImageProps, {}> {
    constructor(props) {
        super(props);

        this.getUrl = this.getUrl.bind(this);
        this.state = { imageSelected: false };
    }

    componentDidMount() {
        this.getUrl();
    }

    async getUrl(): Promise<void> {
        // let resImage = await ApiService.getImage(this.props.imageName + "_");
        let img = document.getElementById(this.props.imageID) as HTMLImageElement;
        // if (img != null) img.src = resImage === null ? "" : resImage.url;
        img.src = 'https://www.wolken.cz/images/product/322/i3.jpg';
    }

    render() {
        return (
            <Card>
                <img id={this.props.imageID} style={imageStyle.img} />
                <CardContent>
                    <Typography type="body2" component="p">
                        Description: {this.props.imageName}
                    </Typography>

                </CardContent>
            </Card>
        );
    }
}