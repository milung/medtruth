import * as React from 'react';
import { PatientProps } from "./PatientView";
import Grid from 'material-ui/Grid';
import seriesStyle from '../styles/ComponentsStyle';
import { PatientView } from "./PatientView";
import { ApiService } from "../api";

interface ArrayOfPatients {
    wait: boolean
    patientList: PatientProps[]
}

export class PatientViewer extends React.Component<{}, ArrayOfPatients> {

    tempPatint: PatientProps = null;

    constructor() {
        super();
        this.state = {
            wait: false,
            patientList: []
        }
    }

    componentWillMount() {
        this.receiveData();
    }

    async receiveData(): Promise<void> {
        let patId = 10;
        let imageId = 10;

        this.setState({ wait: true });
        let resData = await ApiService.getData(12345);
        console.log("got data", resData);

        for (let patient of resData.studies) {
            let tempSeries = [];

            for(let tmpSerie of patient.series){
                let serie = {
                    seriesID: tmpSerie.seriesID,
                    seriesDescription: tmpSerie.seriesDescription,
                    src: tmpSerie.thumbnailImageID,
                    imageId: imageId
                }
                tempSeries.push(serie)
                imageId++;
            }
            this.tempPatint = {
                patientId: patId,
                patientName: patient.patientName,
                dateOfBirth: patient.patientBirthday,
                studyDescription: patient.studyDescription,                
                series: tempSeries
            }
            this.state.patientList.push(this.tempPatint);
            console.log(this.state.patientList);
            patId++;
        }     
        this.setState({ wait: false });
    }

    render() {
        if (!this.state.wait) {
            return (
                <div>

                    <Grid container gutter={16}>
                        {this.state.patientList.map(value =>
                            <Grid item xs={12} sm={12} md={12} style={seriesStyle.seriesStyle} key={value.patientId}>
                                <PatientView {...value} />
                            </Grid>
                        )}
                    </Grid>
                </div>
            );
        } else {
            return <div />;
        }
    }
};