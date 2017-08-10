import * as React from 'react';
import * as Redux from 'redux';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
// import Card, { CardContent } from 'material-ui/Card';
import { AttributeList, ListItem } from './AttributeList';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { ImageAnnotation, ImageAnnotationAddedAction, imageAnnotationAdded } from '../actions/actions';
import { ApiService } from '../api';
import Paper from 'material-ui/Paper';

export interface OwnState {
    keyFieldValue: string;
    valueFieldValue: string;
}
export interface ConnectedState {
    images: string[];
    series: string[];
}

export interface ConnectedDispatch {
    addedImageAnnotation: (annotation: ImageAnnotation) => ImageAnnotationAddedAction;
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
        console.log('images', this.props.images);
        console.log('series', this.props.series);

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

        await changeAttribute(
            false,
            this.props.addedImageAnnotation,
            this.props.series,
            this.state.keyFieldValue,
            valueNumber);
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
        // Check if something is selected
        if (this.props.series.length !== 0) {
            attributeList = <AttributeList />;
        }

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
    console.log('series', state.ui.selections.series);
    let imagesFromState: string[] = [];
    if (state.ui.selections.series.length !== 0 &&
        state.entities.series.byId.get(getLastValue(state.ui.selections.series)) !== null) {
        imagesFromState = state.entities.series.byId.get(getLastValue(state.ui.selections.series)).images;
    }

    return {
        images: imagesFromState,
        series: state.ui.selections.series
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ImageAnnotationAddedAction>): ConnectedDispatch {
    return {
        addedImageAnnotation: (annotation: ImageAnnotation) => dispatch(imageAnnotationAdded(annotation)),
    };
}

export const AttributeForm = connect(mapStateToProps, mapDispatchToProps)(AttributeFormComponent);

export function getLastValue(set) {
    var value;
    for (value of set) {
        return value;
    }
}

export async function changeAttribute(deletingAttribute: boolean, dispatchFunction,
    selection: string[], key: string, value: number): Promise<void> {
    console.log('DELETING ATTRIBUTE', deletingAttribute);
    let resData;
    // for (var img of this.props.images) {
        console.log('deleting ' + key + ' ' + value);
        console.log('selection', selection);
    for (var id of selection) {
        if (deletingAttribute) {
            console.log('deleting attribute');
            let labels: string[] = [];
            labels.push(key);
            // resData = await ApiService.deleteAttributes(id, [key]);
            resData = await ApiService.deleteAttributes(id, labels);
        } else {
            console.log('putting attribute');
            resData = await ApiService.putAttributes(id, {
                key: key,
                value: value
            });
        }
        console.log('res data', resData);

        dispatchFunction({
            imageId: id,
            key: key,
            value: value
        });
    }
}