import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { ApiService } from '../api';
import { getLastValue } from './AttributeForm';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { State } from '../app/store';
import {
    ImageAnnotation, imagesAnnotationAddedAction, ImagesAnnotationAddedAction,
    ImagesAnnotationRemovedAction, ImagesAnnotationsDownloadedAction
} from '../actions/actions';
import * as _ from 'lodash';
import { ImageEntity } from '../reducers/EntitiesReducer';
import {
    removeImagesAnnotationAction, addImagesAnnotationAction,
    downloadImageAnnotations
} from '../actions/asyncActions';

export interface OwnState {
    checkboxes: number[];
    listItems: ListItem[];
}
export interface ConnectedState {
    images: string[];
    annotations: ImageAnnotation[][];
}

export interface ListItem {
    key: string;
    value: number;
}

export interface ConnectedDispatch {
    addImagesAnnotation: (imageIds: string[], annotation: ImageAnnotation) => ImagesAnnotationAddedAction;
    removeImagesAnnotation: (imageIds: string[], label: string) => ImagesAnnotationRemovedAction;
    downloadImageAnnotations: (imageIds: string[]) => ImagesAnnotationsDownloadedAction;
}

export class AttributeListComponent extends React.Component<ConnectedDispatch & ConnectedState, OwnState> {
    private updating = false;
    private multipleSelected = false;

    constructor(props) {
        super(props);

        this.state = {
            checkboxes: [],
            listItems: []
        };
    }

    async componentWillReceiveProps(nextProps: ConnectedState) {
        console.log('COMPONENT WILL RECEIVE PROPS');
        console.log('COMPONENT next annotations', nextProps.annotations);
        console.log('COMPONENT old annotations', this.props.annotations);
        if (nextProps.images !== this.props.images) {
            this.updating = true;
            await this.props.downloadImageAnnotations(this.props.images);
        }
        if (nextProps.annotations !== this.props.annotations || nextProps.images !== this.props.images) {
            // if (nextProps.annotations.length !== 0) {
            console.log('UPDATED, COMPONENT WILL MOUNT');
            this.updating = true;
            await this.receiveAttributes();
        }
    }

    async receiveAttributes() {
        //await this.setState({ wait: true }, async () => {
        let labels: string[] = await ApiService.getLabels();
        console.log('labels', labels);

        // Even if no attributes are assigned to the image, the list of all labels should be shown
        if (labels) {
            var listItems = [];
            var values: number[] = [];
            var occurences: number[] = [];
            var sums: number[] = [];
            var checkboxes: number[] = [];
            // Checkbox values mean the following:
            // -10: unchecked
            // -1: indeterminate
            // equal or greater than 0: checked

            // If more than one thumbnail is selected
            if (this.props.images.length >= 2) {
                this.multipleSelected = true;
                // Set initial values for labels
                for (let label in labels) {
                    values.push(-10);
                    occurences.push(0);
                    sums.push(0);
                    checkboxes.push(-10);
                }
                for (let label in labels) {
                    // Go through the array of annotations of selected images
                    for (let imageAnnotations of this.props.annotations) {
                        // Go through the array of image's annotations
                        for (let annotations in imageAnnotations) {
                            if (imageAnnotations[annotations].key === labels[label]) {
                                // Set the value in array when the label is found for the first time
                                if (occurences[label] === 0) {
                                    values[label] = imageAnnotations[annotations].value;
                                }
                                occurences[label]++;
                                sums[label] += imageAnnotations[annotations].value;
                                break;
                            }
                        }
                    }
                }
                for (var label in values) {
                    // If no images have the attribute assigned, set checkbox to unchecked
                    if (occurences[label] === 0) {
                        checkboxes[label] = -10;
                        // If the sum doesn't check, set checkbox value to indeterminate
                    } else if (sums[label] !== (values[label] * this.props.images.length) ||
                        occurences[label] !== this.props.images.length) {
                        checkboxes[label] = -1;
                    } else {
                        checkboxes[label] = values[label];
                    }
                    listItems.push({
                        key: labels[label],
                        value: checkboxes[label]
                    });
                }
            } else if (this.props.images.length === 1) {
                this.multipleSelected = false;
                for (let label of labels) {
                    var labelFound = false;
                    console.log('attributes', this.props.annotations);
                    let value;
                    if (this.props.annotations.length !== 0) {
                        // console.log('label ATTRIBUTES', resData.attributes);
                        for (let data of this.props.annotations[0]) {
                            if (data.key === label) {
                                labelFound = true;
                                value = data.value;
                                break;
                            }
                        }
                    }
                    if (labelFound) {
                        // If label was already assigned to selected img, set value to 1
                        checkboxes.push(1);
                    } else {
                        checkboxes.push(-10);
                        value = -10;
                    }
                    listItems.push({
                        key: label,
                        value: value
                    });
                }
            }
            this.setState({ listItems: listItems, checkboxes: checkboxes }
                // , () => {
                //     // console.log('SET NEW STATE');
                //     // console.log('CHECKBOXES', this.state.checkboxes);
                //     // console.log('LISTITEMS', listItems);
            );
        } else {
            this.setState({ listItems: [], checkboxes: [] });
        }
    }

    async componentDidMount() {
        console.log('COMPONENT DID MOUNT');
        await this.props.downloadImageAnnotations(this.props.images);
        await this.receiveAttributes();
    }

    render() {
        console.log('ATTRIBUTE LIST ITEMS', this.state.listItems);
        console.log('STATE CHECKBOXES', this.state.checkboxes);
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
                                                checked={this.state.checkboxes[i] >= 0}
                                                indeterminate={this.state.checkboxes[i] === -1}
                                                onChange={async (event: object, checked: boolean) => {
                                                    var checkboxes: number[] = [...this.state.checkboxes];
                                                    let deletingAttribute = false;
                                                    // Decide whether the checkbox is checked or unchecked
                                                    if (checkboxes[i] >= 0) { deletingAttribute = true; }
                                                    console.log('old checkboxes', checkboxes);
                                                    // Set the new checkbox value, 1 for checked, -10 to unchecked
                                                    checkboxes[i] < 0 ? checkboxes[i] = 1 : checkboxes[i] = -10;
                                                    console.log('new checkboxes', checkboxes);
                                                    console.log('deleting attribute ', deletingAttribute);
                                                    this.setState({
                                                        checkboxes: checkboxes,
                                                        //wait: true
                                                    }, async () => {
                                                        if (deletingAttribute) {
                                                            // If the checkbox gets unchecked, remove the annotation from Redux state and db
                                                            await this.props.removeImagesAnnotation(this.props.images, item.key);
                                                        } else {
                                                            // Otherwise add/update the annotation
                                                            await this.props.addImagesAnnotation(this.props.images, {
                                                                key: item.key,
                                                                value: checkboxes[i]
                                                            });
                                                        }
                                                    });
                                                }}
                                            />
                                            {item.key}
                                        </TableCell>
                                        <TableCell >
                                            {(this.state.checkboxes[i] >= 0 && item.value >= 0) ? item.value + '' : ''}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

function mapStateToProps(state: State): ConnectedState {
    let imagesFromState: string[] = [];
    let annotations: ImageAnnotation[][] = [];
    let images: string[] = state.ui.selections.images;

    // if (state.ui.selections.series.length !== 0 &&
    // state.entities.series.byId.get(getLastValue(state.ui.selections.series)) !== null) {
    if (state.ui.selections.images.length !== 0) {
        // Add all annotations of selected images into props
        for (var imageName of images) {
            var imageEntity: ImageEntity = state.entities.images.byId.get(imageName);
            if (imageEntity) {
                if (imageEntity.annotations) {
                    annotations.push(imageEntity.annotations);
                }
            }
        }
    }

    return {
        images: state.ui.selections.images,
        annotations: annotations
    };
}

function mapDispatchToProps(dispatch): ConnectedDispatch {
    return {
        addImagesAnnotation: (imageIds: string[], annotation: ImageAnnotation) =>
            dispatch(addImagesAnnotationAction(imageIds, annotation)),
        removeImagesAnnotation: (imageIds: string[], label: string) =>
            dispatch(removeImagesAnnotationAction(imageIds, label)),
        downloadImageAnnotations: (imageIds: string[]) =>
            dispatch(downloadImageAnnotations(...imageIds))
    };
}

export const AttributeList = connect(mapStateToProps, mapDispatchToProps)(AttributeListComponent);
