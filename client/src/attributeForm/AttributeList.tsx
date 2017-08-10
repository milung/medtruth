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
    series: string[];
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
        if (nextProps.annotations !== this.props.annotations || nextProps.series !== this.props.series) {
            if (nextProps.annotations.length !== 0) {
                console.log('UPDATED, COMPONENT WILL MOUNT');
                this.updating = true;
                await this.receiveAttributes(getLastValue(this.props.series));
            }
        }
    }

    async receiveAttributes(id: string) {
        await this.setState({ wait: true }, async () => {
            let labels: string[] = await ApiService.getLabels();
            console.log('labels', labels);

            // Even if no attributes are assigned to the image, the list of all labels should be shown
            if (labels) {
                var listItems = [];
                var checkboxes: number[] = [];

                // If more than one thumbnail is selected
                if (this.props.series.length >= 2) {
                    console.log('MORE SERIES', this.props.series);
                    this.multipleSelected = true;
                    var values: number[] = [];
                    // Set initial values for labels
                    for (let label in labels) {
                        values.push(0);     
                        checkboxes.push(0);
                    }
                    for (let label in labels) {
                        for (var sel of this.props.series) {
                            let resData = await ApiService.getAttributes(sel);
                            console.log('SERIES DATA', resData);
                            if (resData.attributes) {
                                for (let data in resData.attributes) {
                                    console.log('comparing' + resData.attributes[data].key + ' ' + labels[label]);
                                    if (resData.attributes[data].key === labels[label]) {
                                        console.log('CURRENT LABEL ', labels[label]);
                                        console.log('current label value', values[label]);
                                        values[label] += resData.attributes[data].value;
                                        console.log('plus ', resData.attributes[data].value);
                                        console.log('new value ' + values[label]);
                                        break;
                                    }
                                }
                            }
                        }
                        console.log('LABELS for now', labels);
                    }
                    for (var label in values) {
                        if (values[label] === 0) {
                            checkboxes[label] = 0;
                        } else if (values[label] === this.props.series.length) {
                            checkboxes[label] = 1;
                        } else {
                            checkboxes[label] = -1;
                        }
                        console.log('LABEL ' + labels[label] + ' ' + values[label] + ' ' + checkboxes[label]);
                        listItems.push({
                            key: labels[label],
                            value: checkboxes[label]
                        });
                    }
                } else {
                    console.log('ONE SERIES', this.props.series);
                    this.multipleSelected = false;
                    for (let label of labels) {
                        var labelFound = false;
                        let resData = await ApiService.getAttributes(getLastValue(this.props.series));
                        console.log('COMPONENT GETTING DATA...');
                        console.log('attributes', resData);
                        let value;
                        if (resData.attributes) {
                            console.log('label ATTRIBUTES', resData.attributes);
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
                            console.log(label + 'LABEL FOUND');
                        } else {
                            checkboxes.push(0);
                            console.log(label + 'LABEL NOT FOUND');
                            value = 0;
                        }
                        console.log(label + ' value ' + value);
                        listItems.push({
                            key: label,
                            value: value
                        });
                    }
                }
                this.setState({ listItems: listItems, checkboxes: checkboxes }, () => {
                    console.log('SET NEW STATE');
                    console.log('CHECKBOXES', this.state.checkboxes);
                    console.log('LISTITEMS', listItems);

                    if (!this.updating) {
                        for (var item of listItems) {
                            this.props.addedImageAnnotation({
                                imageId: getLastValue(this.props.series),
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
                console.log('FINISHED RECEIVING ATTRIBUTES');
            });
        });
    }

    async componentDidMount() {
        console.log('COMPONENT DID MOUNT');
        await this.receiveAttributes(getLastValue(this.props.series));
    }

    render() {
        if (!this.state.wait) {
            console.log('ATTRIBUTE LIST ITEMS', this.state.listItems);

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
                                                    checked={this.state.checkboxes[i] === 1}
                                                    indeterminate={this.state.checkboxes[i] === -1}
                                                    onChange={async (event: object, checked: boolean) => {
                                                        var checkboxes: number[] = [...this.state.checkboxes];                                                    
                                                        let deletingAttribute = false;
                                                        if (checkboxes[i] === 1) { deletingAttribute = true; }
                                                        checkboxes[i] === 0 ? checkboxes[i] = 1 : checkboxes[i] = 0;
                                                        await changeAttribute(
                                                            deletingAttribute,
                                                            this.props.addedImageAnnotation,
                                                            this.props.series,
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
    console.log('series', state.ui.selections.series);
    let imagesFromState: string[] = [];
    let annotations: ImageAnnotation[] = [];
    if (state.ui.selections.series.length !== 0 &&
        state.entities.series.byId.get(getLastValue(state.ui.selections.series)) !== null) {
        console.log('GETTING ANNOTATIONS');
        imagesFromState = state.entities.series.byId.get(getLastValue(state.ui.selections.series)).images;

        // For now imageID in redux is seriesID
        annotations = state.entities.images.byId.get(getLastValue(state.ui.selections.series)).annotations;
        // console.log('annotations', annotations);
        // for (var img of imagesFromState) {
        //     annotations.push(img.an)
        // }

        // state.entities.images.byId.get(getLastValue(state.ui.selections.images)).annotations;
        // TODO GET ANNOTATIONS FROM REDUX STATE
        // for (var img of imagesFromState) {
        //     annotations.push(img.an)
        // }
    }
    console.log(imagesFromState);
    console.log(state.ui.selections.series);
    console.log(annotations);
    return {
        images: imagesFromState,
        series: state.ui.selections.series,
        annotations: annotations
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<ImageAnnotationAddedAction>): ConnectedDispatch {
    return {
        addedImageAnnotation: (annotation: ImageAnnotation) => dispatch(imageAnnotationAdded(annotation)),
    };
}

export const AttributeList = connect(mapStateToProps, mapDispatchToProps)(AttributeListComponent);
