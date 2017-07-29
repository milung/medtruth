import * as React from 'react';
import { PatientProps } from "./PatientView";
import Grid from 'material-ui/Grid';
import seriesStyle from '../styles/ComponentsStyle';
import { PatientView } from "./PatientView";
import { ApiService } from "../api";
import { connect } from "react-redux";
import { State } from "../app/store";

interface ArrayOfPatients {
    wait: boolean
    patientList: PatientProps[]
}

interface OwnProps {
    uploadID: number
}

class PatientViewerComponent extends React.Component<OwnProps, ArrayOfPatients> {

    tempPatint: PatientProps = null;

    constructor() {
        super();
        this.state = {
            wait: false,
            patientList: []
        }
    }

    componentWillUpdate(nextProps, nextState){
    if (nextProps.uploadID !== this.props.uploadID) {
        this.receiveData(nextProps.uploadID);
    }
}


    async receiveData(uploadID): Promise<void> {
        let patId = 10;
        let imageId = 10;

        this.setState({ wait: true });

        let resData = await ApiService.getData(uploadID);
        console.log("got data", resData);
        let patients = [];

        for (let patient of resData.studies) {
            let tempSeries = [];

            for (let tmpSerie of patient.series) {
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
            patients.push(this.tempPatint);
            patId++;
        }
        this.setState(Object.assign({},{ wait: false, patientList: patients }));
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

function mapStateToProps(state: State, props: OwnProps): OwnProps {    
    console.log("uploadid: "+state.files.lastUploadID);
    
    return { uploadID: state.files.lastUploadID };
}

export const PatientViewer = connect(mapStateToProps, null)(PatientViewerComponent);