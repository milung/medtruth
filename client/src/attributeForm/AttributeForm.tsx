import * as React from 'react';
import * as Redux from 'redux';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
// import Card, { CardContent } from 'material-ui/Card';
import { AttributeList, ListItem } from './AttributeList';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { ImageAnnotation, ImagesAnnotationAddedAction, imagesAnnotationAddedAction } from '../actions/actions';
import { ApiService } from '../api';
import Paper from 'material-ui/Paper';
import { addImagesAnnotationAction } from '../actions/asyncActions';

export interface OwnState {
    keyFieldValue: string;
    valueFieldValue: string;
}
export interface ConnectedState {
    images: string[];
}

export interface ConnectedDispatch {
    addImagesAnnotation: (imageIds: string[], annotation: ImageAnnotation) => ImagesAnnotationAddedAction;
}

export class AttributeFormComponent extends React.Component<ConnectedDispatch & ConnectedState, OwnState> {

    constructor(props) {
        super(props);
        this.state = {
            keyFieldValue: '',
            valueFieldValue: '',
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyFieldChange = this.handleKeyFieldChange.bind(this);
        this.handleValueFieldChange = this.handleValueFieldChange.bind(this);
    }

    async handleClick(): Promise<void> {
        let valueNumber;
        // If no value is entered in the value field, assign 1
        if (this.state.valueFieldValue === null || this.state.valueFieldValue.trim() === '') {
            valueNumber = 1;
        } else {
            valueNumber = Number(this.state.valueFieldValue);
        }

        this.setState({
            keyFieldValue: '',
            valueFieldValue: ''
        });

        this.props.addImagesAnnotation(this.props.images, {
            key: this.state.keyFieldValue,
            value: valueNumber
        });
    }

    handleKeyFieldChange(e) {
        this.setState({
            keyFieldValue: e.target.value
        });
    }

    handleValueFieldChange(e) {
        this.setState({
            valueFieldValue: e.target.value
        });
    }

    render() {
        var inputIncorrect;

        // Check if value field is in between 0 and 1
        let valueNumber = Number(this.state.valueFieldValue);
        (valueNumber >= 0 && valueNumber <= 1) ? inputIncorrect = false : inputIncorrect = true;

        // Check if key field is empty
        let keyValue = this.state.keyFieldValue;
        if (keyValue === null || keyValue.trim() === '') {
            inputIncorrect = true;
        }

        var attributeList;
        // Check if something is selected, if not, assigning should be disabled
        (this.props.images.length !== 0) ? attributeList = <AttributeList /> : inputIncorrect = true;

        return (
            <div >
                <Grid style={{ position: 'fixed', paddingRight: 10 }} item="true" xs={12} sm={12} md={12}>
                    <Paper style={{ padding: 10 }}>
                        <div>
                            <TextField
                                required="true"
                                error={inputIncorrect}
                                id="keyField"
                                label="Label"
                                margin="dense"
                                style={{ width: '100%' }}
                                value={this.state.keyFieldValue}
                                onChange={this.handleKeyFieldChange}
                            />
                            <TextField
                                error={inputIncorrect}
                                id="valueField"
                                label="Value"
                                margin="dense"
                                style={{ width: '50%' }}
                                value={this.state.valueFieldValue}
                                onChange={this.handleValueFieldChange}
                            />
                            <Button
                                disabled={inputIncorrect}
                                id="assignButton"
                                type="submit"
                                raised="true"
                                color="primary"
                                onClick={this.handleClick}
                                style={{ float: 'right', marginTop: 20, marginBottom: 20 }}
                            >
                                Assign
                            </Button>
                        </div>
                    </Paper>
                    {attributeList}
                </Grid>
            </div>);

    }
}

function mapStateToProps(state: State): ConnectedState {
    // let imagesFromState: string[] = [];
    // if (state.ui.selections.series.length !== 0 &&
    //     state.entities.series.byId.get(getLastValue(state.ui.selections.series)) !== null) {
    //     imagesFromState = state.entities.series.byId.get(getLastValue(state.ui.selections.series)).images;
    // }
    return {
        images: state.ui.selections.images
    };
}

function mapDispatchToProps(dispatch): ConnectedDispatch {
    return {
        addImagesAnnotation: (imageIds: string[], annotation: ImageAnnotation) => 
            dispatch(addImagesAnnotationAction(imageIds, annotation)),
    };
}

export const AttributeForm = connect(mapStateToProps, mapDispatchToProps)(AttributeFormComponent);

export function getLastValue(set) {
    var value;
    for (value of set) {
        return value;
    }
}
