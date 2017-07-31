import * as React from 'react';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import { ImageView } from './ImageView';

export interface SeriesProps {
    seriesID: string;
    seriesDescription: string;
    src: string; 
    imageId: string;    
}

export class SerieView extends React.Component<SeriesProps, {}> {
    constructor(props: SeriesProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <Card >
                    <CardMedia>
                        <ImageView imageName={this.props.src}  imageId={this.props.imageId}/>
                    </CardMedia>
                    <CardContent>
                        <Typography  type="body2" component="p">
                            {this.props.seriesDescription}
                        </Typography>
                    </CardContent>
                </Card>                
            </div>
        );
    }
};