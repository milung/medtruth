import * as React from 'react';
import { SerieView, SeriesProps } from "./SerieView";
import Grid from 'material-ui/Grid';
import seriesStyle from '../styles/ComponentsStyle';

interface ArrayOfSeries{
    list: SeriesProps[]
}
let seriesData: SeriesProps[];
export class SeriesViewer extends React.Component<ArrayOfSeries, {}> {

    constructor(props: ArrayOfSeries){
        super(props);
        seriesData = props.list;
    }

    render() {
        return (
            <div>
                <Grid container gutter={16}>
                    {seriesData.map(value =>
                        <Grid item  xs={6} sm={3} md={2} style={seriesStyle.seriesStyle} key={value.seriesID}>
                            <SerieView {...value} />
                        </Grid>
                        )}
                </Grid>
            </div>
        );
    }
};