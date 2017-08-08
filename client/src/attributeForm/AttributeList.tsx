import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { ApiService } from '../api';
import { addAttribute, getLastValue } from "./AttributeForm";
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { State } from '../app/store';
import { ImageAnnotation, ImageAnnotationAddedAction, imageAnnotationAdded } from '../actions/actions';

export interface OwnState {
    activeCheckboxes: boolean[];
    wait: boolean;
    listItems: ListItem[];
}
export interface ConnectedState {
    images: string[];
    series: string[];
    annotations: ImageAnnotation[];
}

export interface ListItem {
    attribute: string;
    value: number;
}

export interface ConnectedDispatch {
    addedImageAnnotation: (annotation: ImageAnnotation) => ImageAnnotationAddedAction;
}

export class AttributeListComponent extends React.Component<ConnectedDispatch & ConnectedState, OwnState> {
    constructor(props) {
        super(props);

        this.state = {
            activeCheckboxes: [],
            wait: false,
            listItems: []
        };

        this.receiveAttributes(getLastValue(this.props.series));
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
            var checkboxes = [];
            for (let data of resData.attributes) {
                listItems.push({
                    attribute: data.key,
                    value: data.value
                });
                (data.value > 0) ? checkboxes.push(true) : checkboxes.push(false);

                // this.props.addedImageAnnotation({
                //     imageId: id,
                //     key: data.key,
                //     value: data.value
                // });
            }
            this.setState({ listItems: listItems, activeCheckboxes: checkboxes });
        } else {
            this.setState({ listItems: [], activeCheckboxes: [] });
        }
        this.setState({ wait: false });
        console.log("checkboxes", this.state.activeCheckboxes);
    }

    render() {
        // Check if selected series/image has any attributes
        if (this.state.listItems.length !== 0) {
            console.log("ATTRIBUTE LIST SHOULD RENDER");

            // if (!this.state.wait) {
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
                                                    checked={this.state.activeCheckboxes[i]}
                                                    indeterminate={false}
                                                    onChange={async (event: object, checked: boolean) => {
                                                        var checkboxes: boolean[] = [...this.state.activeCheckboxes];
                                                        checkboxes[i] = !checkboxes[i];
                                                        var items = [...this.state.listItems];
                                                        items[i].value = checkboxes[i] ? 1 : 0;
                                                        
                                                        this.setState({
                                                            activeCheckboxes: checkboxes,
                                                            listItems: items
                                                        });

                                                        addAttribute(this.props.addedImageAnnotation, this.props.series, item.attribute, checkboxes[i] ? 1 : 0);
                                                    }}
                                                />
                                                {item.attribute}
                                            </TableCell>
                                            <TableCell >
                                                {item.value}
                                                {/*this.state.activeCheckboxes.indexOf(item.attribute) >= 0 ? 1 : 0*/}
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
        imagesFromState = state.entities.series.byId.get(getLastValue(state.ui.selections.series)).images;

        //state.entities.images.byId.get(getLastValue(state.ui.selections.images)).annotations;
        // TODO GET ANNOTATIONS FROM REDUX STATE
        // for (var img of imagesFromState) {
        //     annotations.push(img.an)
        // }
    }

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
