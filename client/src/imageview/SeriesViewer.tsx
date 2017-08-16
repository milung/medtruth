import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { SerieView, SeriesProps } from './SerieView';
import { ApiService } from "../api";

export interface ArrayOfSeries {
    list: SeriesProps[];
    patientID: string;
    studyID: string;
}

interface OwnProps {
    match: any;
}

interface State {
    wait: boolean;
}
export class SeriesViewer extends React.Component<OwnProps & ArrayOfSeries, State> {

    private seriesData: SeriesProps[] = []; 
    constructor(props) {
        super(props);
        console.log('SERIES VIEWER');
    }

    async componentDidMount() {
        await this.receiveData();
    }

    async receiveData(): Promise<void> {
        this.setState({ wait: true });

        let resData = await ApiService.getData(4);

        // this.props.uploadedDataDownloaded(resData);
        console.log('got data', resData);
        let tempSeries = [];

        for (let patient of resData.listOfPatients) {
            
            // console.log("len ist of patients",resData.listOfPatients.length)
            
            if (patient.patientID == this.props.match.params.patientID) {
                for (let tmpStudy of patient.studies) {
                    if (tmpStudy.studyID == this.props.match.params.studyID) {
                        for (let series of tmpStudy.series) {
                            tempSeries.push({
                                seriesID: series.seriesID,
                                seriesDescription: series.seriesDescription,
                                src: series.thumbnailImageID,
                                imageID: series.thumbnailImageID,
                                studyID: tmpStudy.studyID,
                                patientID: this.props.match.params.patientID
                            });
                        }
                    }
                }
            }
            console.log('series', tempSeries)
        }
        this.seriesData = tempSeries;
        this.setState({ wait: false});
    }

    render() {
        console.log('SERIES VIEWER RENDER');
        console.log('patientID', this.props.match.params.patientID);
        console.log('studyID', this.props.match.params.studyID);
        
        return (
            <div>
                <Grid container={true} gutter={16}>
                    {this.seriesData.map(value =>
                        <Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} key={value.seriesID}>
                            <SerieView {...value} />
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }
}