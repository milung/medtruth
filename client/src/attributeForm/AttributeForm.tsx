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
    wait: boolean;
    seriesData: ListItem[];
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
            wait: false,
            seriesData: []
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleKeyFieldChange = this.handleKeyFieldChange.bind(this);
        this.handleValueFieldChange = this.handleValueFieldChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log('nextProps.series: ', nextProps.series);
        // console.log('this.props.series', this.props.series);
        if (nextProps.series !== this.props.series) {
            if (nextProps.series.length !== 0) {
                this.receiveAttributes(getLastValue(nextProps.series));
            }
        }
    }

    async receiveAttributes(id: string): Promise<void> {
        this.setState({ wait: true });
        let resData = await ApiService.getAttributes(id);

        console.log('got data', resData);
        if (resData.attributes) {
            var listItems = [];
            for (let data of resData.attributes) {
                
                listItems.push({
                    attribute: data.key,
                    value: data.value
                });

                this.props.addedImageAnnotation({
                    imageId: id,
                    key: data.key,
                    value: data.value
                });
            }
            this.setState({ seriesData: listItems });
        } else {
            this.setState({ seriesData: [] });
        }
        this.setState({ wait: false });

    }

    // Called from AttributeList on Checkbox change
    async handleChange(key: string, value: number) {
        await this.addAttribute(key, value);
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

        await this.addAttribute(this.state.keyFieldValue, valueNumber);
    }

    async addAttribute(key: string, value: number): Promise<void> {
        console.log("ADDING ATTRIBUTE");
        let resData;
        // for (var img of this.props.images) {
        for (var series of this.props.series) {
            this.props.addedImageAnnotation({
                imageId: series,
                key: key,
                value: value
            });
            resData = await ApiService.putAttributes(series, {
                key: key,
                value: value
            });
        }

        this.setState({
            keyFieldValue: '',
            valueFieldValue: ''
        });

        await this.receiveAttributes(getLastValue(Array.from(this.props.series)));
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
            // Check if selected series/image has any attributes
            if (this.state.seriesData.length !== 0) {
                attributeList = <AttributeList listItems={this.state.seriesData} selection={this.props.series} handler={this.handleChange} />;
                console.log(this.state.seriesData);
            }
        }

        if (!this.state.wait) {
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
        } else {
            return <div />;
        }
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