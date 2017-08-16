import * as React from 'react';
import Grid from 'material-ui/Grid';
import { imageStyle } from '../styles/ComponentsStyle';
import { SerieView, SeriesProps } from './SerieView';
import { ArrayOfSeries } from "./SeriesViewer";
import { StudyViewComponent, StudiesProps, StudyView } from "./StudyView";
import { ApiService } from "../api";



export interface ArrayOfStudies {
    listOfStudies: StudiesProps[];
}
let studiesData: StudiesProps[] = []
let studyOne: StudiesProps;
// studyOne={
//     studyID:"prva",
//     studyDescription: "desciptions",
//     series: null,

// };
// studiesData.push(studyOne);


interface OwnState {
    match: any;
}

interface State {
    wait: boolean;
}


export class StudyViewer extends React.Component<OwnState, State> {

    private studiesList: StudiesProps[] = [];
    constructor() {
        super();
        this.state = {
            wait: false
        }
        //studiesData = props.listOfStudies;
    }

    async componentDidMount() {
        await this.receiveData(this.props.match.params.patientID);
    }

    // patientID: patient.patientID,
    // patientName: patient.patientName,
    // dateOfBirth: patient.dateOfBirth,   
    async receiveData(patientID: string): Promise<void> {

        this.setState({ wait: true });

        let resData = await ApiService.getData(12345);

        // this.props.uploadedDataDownloaded(resData);
        console.log('got data', resData);
        let tmpStudies = [];

        for (let patient of resData.listOfPatients) {
            // console.log("len ist of patients",resData.listOfPatients.length)
            console.log('patient id' + typeof(patient.patientID) + ' ' + patient.patientID);
            console.log('patient id match' + this.props.match.params.patientID + ' ' + this.props.match.params.patientID);

            if (patient.patientID == this.props.match.params.patientID) {
                console.log('patient ' + this.props.match.params.patientID + ' found');
                console.log('patient studies', patient.studies);
                for (let tmpStudy of patient.studies) {
                    //  console.log("tmpStudy",tmpStudy)
                    let study: StudiesProps = {
                        // TODO REMOVE PATIENT ID
                        patientID:  this.props.match.params.patientID,
                        studyID: tmpStudy.studyID,
                        studyDescription: tmpStudy.studyDescription,
                        series: null,
                    };
                    tmpStudies.push(study);
                }
            } 
            console.log('studies', tmpStudies);
        }
       this.studiesList = tmpStudies;
       console.log('studies list', this.studiesList);
       this.setState({ wait: false });
    }

    render() {
        console.log('render');
        console.log('render studies list', this.studiesList);
        return (
            <div>
                <Grid container={true} gutter={16}>
                    {console.log("ID pacienta " + this.props.match.params.patientID)}
                    {this.studiesList.map(value =>
                        //<Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} //key={value.seriesID}>
                        <Grid item={true} xs={6} sm={3} md={2} style={imageStyle.seriesStyle} >
                            <StudyView {...value} />
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }
}