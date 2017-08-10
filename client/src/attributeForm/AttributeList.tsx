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

export interface OwnState {
    checkboxes: boolean[];
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

    constructor(props) {
        super(props);

        this.state = {
            checkboxes: [],
            wait: false,
            listItems: []
        };

        //this.receiveAttributes(getLastValue(this.props.series));
    }

    async componentWillReceiveProps(nextProps: ConnectedState) {
        console.log('COMPONENT WILL RECEIVE PROPS');
        console.log('COMPONENT next annotations', nextProps.annotations);
        console.log('COMPONENT old annotations', this.props.annotations);
        if (nextProps.annotations !== this.props.annotations) {
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

            let resData = await ApiService.getAttributes(getLastValue(this.props.series));
            console.log('COMPONENT GETTING DATA...');
            console.log('attributes', resData);

            // if (labels && resData.attributes) {
            // Even if no attributes are assigned to the image, the list of all labels should be shown
            if (labels) {
                var listItems = [];
                var checkboxes = [];
                for (let label of labels) {
                    var labelFound = false;
                    var value;
                    if (resData.attributes) {
                        console.log('label ATTRIBUTES', resData.attributes);
                        for (let data of resData.attributes) {
                            if (data.key === label) {
                                labelFound = true;
                                value = data.value;
                                // (data.value > 0) ? checkboxes.push(true) : checkboxes.push(false);
                                break;
                            }
                        }
                    }
                    if (labelFound) {
                        // If label was already assigned to selected img
                        checkboxes.push(true);
                        console.log(label + 'LABEL FOUND');
                    } else {
                        checkboxes.push(false);
                        console.log(label + 'LABEL NOT FOUND');
                        value = 0;
                    }
                    console.log(label + ' value ' + value);
                    listItems.push({
                        key: label,
                        value: value
                    });
                }
                console.log('labels end');
                // for (let data of resData.attributes) {
                //     listItems.push({
                //         key: data.key,
                //         value: data.value
                //     });
                //     (data.value > 0) ? checkboxes.push(true) : checkboxes.push(false);
                // }
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
        // Check if selected series/image has any attributes
        //if (this.state.listItems.length !== 0 && !this.state.wait) {
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
                                    {/* {this.props.annotations.map((item, i) => { */ }
                                    {/* var checked = false;
                                var indeterminate = false;
                                //console.log(item.value);
                                if (item.value > 0) {
                                    checked = true;
                                }
                                if (item.value > 0 && item.value < 1) {
                                    indeterminate = true;
                                } */}
                                    return (
                                        <TableRow key={i}>
                                            <TableCell checkbox="true" >
                                                <Checkbox
                                                    checked={this.state.checkboxes[i]}
                                                    indeterminate={false}
                                                    onChange={async (event: object, checked: boolean) => {
                                                        var checkboxes: boolean[] = [...this.state.checkboxes];
                                                        console.log('OLD CHECKBOXES', checkboxes);
                                                        // If attribute was checked and now gets unchecked
                                                        let deletingAttribute = false;
                                                        if (checkboxes[i]) { deletingAttribute = true };
                                                        checkboxes[i] = !checkboxes[i];
                                                        console.log('NEW CHECKBOXES', checkboxes);
                                                        await changeAttribute(
                                                            deletingAttribute,
                                                            this.props.addedImageAnnotation,
                                                            this.props.series,
                                                            //TODO change this to images
                                                            item.key, checkboxes[i] ? 1 : 0
                                                        );

                                                        this.setState({
                                                            checkboxes: checkboxes,
                                                        });
                                                        {/* var checkboxes: boolean[] = [...this.state.activeCheckboxes];
                                                        console.log(this.state.activeCheckboxes);
                                                        checkboxes[i] = !checkboxes[i];
                                                        var items = [...this.state.listItems];
                                                        items[i].value = checkboxes[i] ? 1 : 0;

                                                        this.setState({
                                                            activeCheckboxes: checkboxes,
                                                            listItems: items
                                                        }, () => {
                                                            console.log(this.state.activeCheckboxes);
                                                        }); */}
                                                    }}
                                                />
                                                {item.key}
                                            </TableCell>
                                            <TableCell >
                                                {item.value}
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
