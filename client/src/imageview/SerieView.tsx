import * as React from 'react';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { ImageView } from './ImageView';

export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    src: string;
    imageID: string;
}

export class SerieView extends React.Component<SeriesProps, {}> {
    constructor(props: SeriesProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {

    }

    render() {
        return (
            <div>
                <Card>
                    <CardMedia style={{border: "3px solid white"}}>
                        <ImageView imageName={this.props.src} imageID={this.props.imageID}/>
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