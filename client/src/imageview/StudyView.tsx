import * as React from 'react';
import * as Redux from 'redux';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import {
    SeriesSelectedAction, seriesSelected,
    thumbnailBlownUp, ThumbnailBlownUpAction, Keys, ActionType, ItemSelectedAction, itemSelected, ItemTypes
} from '../actions/actions';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { imageStyle } from '../styles/ComponentsStyle';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import { SeriesEntity } from "../reducers/EntitiesReducer";
import { getSeriesesWhereStudyId } from "../selectors/selectors";

export interface StudiesProps {
    patientID: string;  
    studyID: string;
    studyDescription: string;
}

interface OwnProps {
    match: any;
}

export interface ConnectedDispatch {
    blowUp: (imageID: string) => ThumbnailBlownUpAction;
    selectItem: (itemId: string, keyPressed: Keys) => ItemSelectedAction;
}

export interface ConnectedState {
    isSelected: boolean;
    seriesOfStudie: SeriesEntity[];
}
export class StudyViewComponent extends React.Component<OwnProps & StudiesProps & ConnectedDispatch & ConnectedState, StudiesProps> {

    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }

    getSeriePath(): string {
        return `/studies/${this.props.studyID}/${this.props.patientID}`;
    }

    clickHandler(event) {
        let keyPressed: Keys = Keys.NONE;

        if (event.ctrlKey) {
            keyPressed = Keys.CTRL;
        }

        this.props.selectItem(this.props.studyID, keyPressed);
    }

    getBorderStyle(isSelected: boolean) {
        return isSelected ? '3px solid LightSeaGreen' : '3px solid white';
    }

    render() {
        console.log('path' + this.getSeriePath());
        return (
            <div >
                <Card
                    onClick={this.clickHandler}
                    style={{ border: this.getBorderStyle(this.props.isSelected) }}
                >
                    <CardContent style={imageStyle.contentCenter}>                        
                        <Typography type="body2" component="p">
                            Study description: <b>{this.props.studyDescription}</b>
                        </Typography>
                        <Typography type="body2" component="p">
                            Number of series: <b>{this.props.seriesOfStudie.length}</b>
                        </Typography>
                         <Link to={this.getSeriePath()}>
                        <a>
                            <img
                                src={require('../icons/icon1.png')}
                                style={{ float: 'right', marginBottom: '5', marginRight: '5' }}
                            />
                        </a>
                    </Link>

                    </CardContent>
                   
                </Card>
            </div>
        );
    }
}

function mapStateToProps(state: State, props: StudiesProps): StudiesProps & ConnectedState {
    return {
        patientID: props.patientID,
        studyID: props.studyID,
        studyDescription: props.studyDescription,
        isSelected: isStudySelected(state, props.studyID),
        seriesOfStudie: getSeriesesWhereStudyId(state, props.studyID)
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ActionType>): ConnectedDispatch {
    return {
        blowUp: (imageID: string) => dispatch(thumbnailBlownUp(imageID)),
        selectItem: (itemId: string, keyPressed: Keys) => dispatch(itemSelected(ItemTypes.STUDY, itemId, keyPressed))
    };
}

export const StudyView = connect(mapStateToProps, mapDispatchToProps)(StudyViewComponent);

const isStudySelected = (state: State, studyId: string): boolean => {
    return state.ui.selections.studies.indexOf(studyId) !== -1;
};