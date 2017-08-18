import * as React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { store, State } from '../app/store';
import { SeriesViewer } from './SeriesViewer';
import { SeriesProps } from './SerieView';
import { StudiesProps } from './StudyView';
import { Link } from 'react-router-dom';

export interface PatientProps {
    patientID: string;
    patientName: string;
    patientBirthday: number;
    // studies: StudiesProps[];
}

export interface PatientList {
    patientList: PatientProps[];
}

export class PatientView extends React.Component<PatientProps, {}> {

    constructor(props: PatientProps) {
        super(props);

        this.convertDate = this.convertDate.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    componentDidMount() {
        // let reduxState: State = store.getState() as State;
        // if (this.props.s[0].studyID === reduxState.ui.lastViewedStudyID) {
        //     let doc = document.getElementById(this.props.series[0].studyID);
        //     console.log('document: ', doc);
        //     doc.scrollIntoView();
        //     window.scrollBy(0, -50);
        // }
    }

    handleDoubleClick() {
        console.log('double click!', this.props.patientID);

    }

    render() {
        return (
            <div id={this.props.patientID + ''} >
                <Card onDoubleClick={this.handleDoubleClick}>
                    <CardContent>
                        <img
                            src={require('../icons/account.png')}
                            // style={{ float: 'left', marginTop: '10', marginLeft: '10' }}
                            style={{ float: 'left', width: 60, height: 60, paddingRight: 20 }}
                        />
                        <Typography type="body2" component="p">
                            Patient name: {this.props.patientName}
                        </Typography>
                        <Typography type="body2" component="p">
                            Date of birth: {this.convertDate(this.props.patientBirthday)}
                        </Typography>
                        {/* <Typography type="body2" component="p">
                            Study description: {this.props.studyDescription}
                        </Typography> */}
                        <Link to={'/patients/' + this.props.patientID}>
                            <a>
                                <img
                                    src={require('../icons/icon1.png')}
                                    style={{ float: 'right'}}
                                />
                            </a>
                        </Link>
                    </CardContent>
                    {/* <CardContent>
                        <SeriesViewer list={this.props.series} />
                    </CardContent> */}
                </Card>
            </div>
        );
    }

    private convertDate(millisecond: number): string {
        console.log('date number', millisecond);
        if (millisecond === -1) {
            return 'Date not specified.';
        }
        var d = new Date(millisecond);
        var datestring = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
            d.getFullYear();
        return datestring;
    }
}