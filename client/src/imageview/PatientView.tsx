import * as React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { State } from '../app/store';
import { SeriesViewer } from './SeriesViewer';
import { SeriesProps } from './SerieView';
import { StudiesProps } from './StudyView';
import { Link } from 'react-router-dom';
import { ItemSelectedAction, Keys, ActionType, itemSelected, ItemTypes } from '../actions/actions';
import * as Redux from 'redux';
import { connect } from 'react-redux';

export interface PatientProps {
    patientID: string;
    patientName: string;
    patientBirthday: number;
    // studies: StudiesProps[];
}

export interface PatientList {
    patientList: PatientProps[];
}

export interface ConnectedState {
    isSelected: boolean;
}

export interface ConnectedDispatch {
    selectItem: (itemId: string, keyPressed: Keys) => ItemSelectedAction;
}

export class PatientViewComponent extends React.Component<PatientProps & ConnectedState & ConnectedDispatch, {}> {

    constructor(props) {
        super(props);

        this.convertDate = this.convertDate.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
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

    clickHandler(event) {
        let keyPressed: Keys = Keys.NONE;

        if (event.ctrlKey) {
            keyPressed = Keys.CTRL;
        }

        this.props.selectItem(this.props.patientID, keyPressed);
    }

    getBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
        return (
            <div id={this.props.patientID + ''} >

                <Card
                    onClick={this.clickHandler}
                    style={{ border: this.getBorderStyle(this.props.isSelected) }}
                >
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
                                    style={{ float: 'right' }}
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

function mapStateToProps(state: State, props): ConnectedState & PatientProps {

    return {
        isSelected: isPatientSelected(state, props.patientID),
        ...props
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        selectItem: (itemId: string, keyPressed: Keys) => dispatch(itemSelected(ItemTypes.PATIENT, itemId, keyPressed))
    };
}

export const PatientView = connect(mapStateToProps, mapDispatchToProps)(PatientViewComponent);

const isPatientSelected = (state: State, patientId: string): boolean => {
    return state.ui.selections.patients.indexOf(patientId) !== -1;
};