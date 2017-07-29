import * as React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import { SeriesViewer } from './SeriesViewer';
import { SeriesProps } from './SerieView';

export interface PatientProps {
    patientId: number;
    patientName: string;
    dateOfBirth: number;
    studyDescription: string;
    series: SeriesProps[];
}

export class PatientView extends React.Component<PatientProps, {}> {

    constructor(props: PatientProps) {
        super(props);
        this.convertDate = this.convertDate.bind(this);
    }

    render() {
        return (
            <div>
                <Card >
                    <CardContent>
                        <Typography type="body2" component="p">
                            Patient name: {this.props.patientName}
                        </Typography>
                        <Typography type="body2" component="p">
                            Date of birth: {this.convertDate(this.props.dateOfBirth)}
                        </Typography>
                        <Typography type="body2" component="p">
                            Study description: {this.props.studyDescription}
                        </Typography>
                    </CardContent>
                    <CardContent>
                        <SeriesViewer list={this.props.series} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    private convertDate(milisecond: number): string {
        if(milisecond == -1) return "Date not specified."
        var d = new Date(milisecond);
        var datestring = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
            d.getFullYear();
        return datestring;
    }
}