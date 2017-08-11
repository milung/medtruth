import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { ApiService } from '../api';
import { changeAttribute, getLastValue } from './AttributeForm';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { ImageAnnotation, ImageAnnotationAddedAction, imageAnnotationAdded } from '../actions/actions';
import * as _ from 'lodash';

export interface OwnState {
    checkboxes: number[];
    wait: boolean;
    listItems: ListItem[];
}
export interface ConnectedState {
    images: string[];
    annotations: ImageAnnotation[];
}

export interface ListItem {
    key: string;
    value: number;
}

export interface ConnectedDispatch {
    addedImageAnnotation: (annotation: ImageAnnotation) => ImageAnnotationAddedAction;
}

export class AttributeListComponent extends React.Component<ConnectedDispatch & ConnectedState, OwnState> {
    private updating = false;
    private multipleSelected = false;

    constructor(props) {
        super(props);

        this.state = {
            checkboxes: [],
            wait: false,
            listItems: []
        };
    }

    async componentWillReceiveProps(nextProps: ConnectedState) {
        console.log('COMPONENT WILL RECEIVE PROPS');
        console.log('COMPONENT next annotations', nextProps.annotations);
        console.log('COMPONENT old annotations', this.props.annotations);
        if (nextProps.annotations !== this.props.annotations || nextProps.images !== this.props.images) {
            //if (nextProps.annotations.length !== 0) {
            console.log('UPDATED, COMPONENT WILL MOUNT');
            this.updating = true;
            this.setState({ wait: true }, async () => {
                await this.receiveAttributes();
            });
        }
    }

    async receiveAttributes() {
        await this.setState({ wait: true }, async () => {
            let labels: string[] = await ApiService.getLabels();
            console.log('labels', labels);

            // Even if no attributes are assigned to the image, the list of all labels should be shown
            if (labels) {
                var listItems = [];
                var values: number[] = [];
                var occurences: number[] = [];
                var sums: number[] = [];
                var checkboxes: number[] = [];

                // If more than one thumbnail is selected
                if (this.props.images.length >= 2) {
                    this.multipleSelected = true;
                    // Set initial values for labels
                    for (let label in labels) {
                        values.push(0);
                        occurences.push(0);
                        sums.push(0);
                        checkboxes.push(0);
                    }
                    for (let label in labels) {
                        for (var img of this.props.images) {
                            let resData = await ApiService.getAttributes(img);
                            if (resData.attributes) {
                                for (let data in resData.attributes) {
                                    if (resData.attributes[data].key === labels[label]) {
                                        if (occurences[label] === 0) {
                                            values[label] = resData.attributes[data].value;
                                        }
                                        occurences[label]++;
                                        sums[label] += resData.attributes[data].value;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    for (var label in values) {
                        (sums[label] !== (values[label] * this.props.images.length)) ?
                            checkboxes[label] = -1 :
                            checkboxes[label] = values[label];
                        listItems.push({
                            key: labels[label],
                            value: checkboxes[label]
                        });
                    }
                } else if (this.props.images.length === 1) {
                    this.multipleSelected = false;
                    for (let label of labels) {
                        var labelFound = false;
                        let resData = await ApiService.getAttributes(this.props.images[0]);
                        console.log('COMPONENT GETTING DATA...');
                        console.log('attributes', resData);
                        let value;
                        if (resData.attributes) {
                            // console.log('label ATTRIBUTES', resData.attributes);
                            for (let data of resData.attributes) {
                                if (data.key === label) {
                                    labelFound = true;
                                    value = data.value;
                                    break;
                                }
                            }
                        }
                        if (labelFound) {
                            // If label was already assigned to selected img
                            checkboxes.push(1);
                            // console.log(label + 'LABEL FOUND');
                        } else {
                            checkboxes.push(0);
                            // console.log(label + 'LABEL NOT FOUND');
                            value = 0;
                        }
                        // console.log(label + ' value ' + value);
                        listItems.push({
                            key: label,
                            value: value
                        });
                    }
                }
                this.setState({ listItems: listItems, checkboxes: checkboxes }, () => {
                    // console.log('SET NEW STATE');
                    // console.log('CHECKBOXES', this.state.checkboxes);
                    // console.log('LISTITEMS', listItems);

                    if (!this.updating) {
                        for (var item of listItems) {
                            this.props.addedImageAnnotation({
                                imageId: this.props.images[0],
                                key: item.key,
                                value: item.value
                            });
                        }
                        this.updating = false;
                    }
                });
            } else {
                this.setState({ listItems: [], checkboxes: [] });
            }
            await this.setState({ wait: false }, () => {
                // console.log('FINISHED RECEIVING ATTRIBUTES');
            });
        });
    }

    async componentDidMount() {
        console.log('COMPONENT DID MOUNT');
        await this.receiveAttributes();
    }

    render() {
        if (!this.state.wait) {
            // console.log('ATTRIBUTE LIST ITEMS', this.state.listItems);
            // console.log('STATE CHECKBOXES', this.state.checkboxes);
            return (
                <div>
                    <Paper style={{ maxHeight: '65vh', overflowY: 'auto', width: '100%' }}>
                        <Table bodyStyle={{ height: 'inherit', overflowX: 'auto' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Label </TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {this.state.listItems.map((item, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell checkbox="true" >
                                                <Checkbox
                                                    checked={this.state.checkboxes[i] > 0}
                                                    indeterminate={this.state.checkboxes[i] === -1}
                                                    onChange={async (event: object, checked: boolean) => {
                                                        var checkboxes: number[] = [...this.state.checkboxes];
                                                        let deletingAttribute = false;
                                                        if (checkboxes[i] > 0) { deletingAttribute = true; }
                                                        checkboxes[i] === 0 ? checkboxes[i] = 1 : checkboxes[i] = 0;
                                                        await changeAttribute(
                                                            deletingAttribute,
                                                            this.props.addedImageAnnotation,
                                                            this.props.images,
                                                            // TODO change this to images
                                                            item.key, checkboxes[i]
                                                        );
                                                        this.setState({
                                                            checkboxes: checkboxes,
                                                        });
                                                    }}
                                                />
                                                {item.key}
                                            </TableCell>
                                            <TableCell >
                                                {(this.multipleSelected) ? this.state.checkboxes[i] : item.value}
                                                {/* {this.state.checkboxes[i]} */}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            );
        } else {
            return (<div />);
        }
    }
}

function mapStateToProps(state: State): ConnectedState {
    let imagesFromState: string[] = [];
    let annotations: ImageAnnotation[] = [];
    if (state.ui.selections.series.length !== 0 &&
        state.entities.series.byId.get(getLastValue(state.ui.selections.series)) !== null) {
        
        annotations = [];     
    }

    return {
        images: state.ui.selections.images,
        annotations: annotations
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ImageAnnotationAddedAction>): ConnectedDispatch {
    return {
        addedImageAnnotation: (annotation: ImageAnnotation) => dispatch(imageAnnotationAdded(annotation)),
    };
}

export const AttributeList = connect(mapStateToProps, mapDispatchToProps)(AttributeListComponent);
