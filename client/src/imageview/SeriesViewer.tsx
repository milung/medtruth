import * as React from 'react';
import Grid from 'material-ui/Grid';
import {imageStyle} from '../styles/ComponentsStyle';

import { SerieView, SeriesProps } from './SerieView';

interface ArrayOfSeries {
    list: SeriesProps[];
}
let seriesData: SeriesProps[];

export class SeriesViewer extends React.Component<ArrayOfSeries, {}> {

    constructor(props: ArrayOfSeries) {
        super(props);
        seriesData = props.list;
    }

    render() {
        return (
            <div>
                <Grid container={true} gutter={16}>
                    {seriesData.map(value =>
                        <Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} key={value.seriesID}>
                            <SerieView {...value} />
                        </Grid>
                        )}
                </Grid>
            </div>
        );
    }
};