import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { ApiService } from '../api';
// import * as Redux from 'redux';
// import { connect } from 'react-redux';
// import { State } from '../app/store';
// import { ImageAnnotation, ImageAnnotationAddedAction, imageAnnotationAdded } from '../actions/actions';

export interface ListItem {
    attribute: string;
    value: number;
}

export interface OwnProps {
    listItems: ListItem[];
    selection: string[];
    handler: (...args: any[]) => void;
}

export interface ListState {
    activeCheckboxes: string[];
}

export class AttributeList extends React.Component<OwnProps, ListState> {
    constructor(props) {
        super(props);
        var active: string[] = [];
        var inactive: string[] = [];
        for (var item of this.props.listItems) {
            if (item.value > 0) {
                active.push(item.attribute);
            }
        }
        this.state = {
            activeCheckboxes: active,
        };
    }

    render() {
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
                            {this.props.listItems.map((item, i) => {
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
                                                checked={this.state.activeCheckboxes.indexOf(item.attribute) >= 0}
                                                indeterminate={false}
                                                onChange={async (event: object, checked: boolean) => {
                                                    var checkAdded = false;

                                                    if (this.state.activeCheckboxes.indexOf(item.attribute) >= 0) {
                                                        // Uncheck
                                                        this.setState({
                                                            activeCheckboxes: this.state.activeCheckboxes
                                                                .filter(x => x !== item.attribute)
                                                        });
                                                    } else {
                                                        // Check
                                                        this.setState({
                                                            activeCheckboxes: this.state.activeCheckboxes
                                                                .concat(item.attribute)
                                                        });
                                                        checkAdded = true;
                                                    }
                                                    this.props.handler(item.attribute, checkAdded ? 1 : 0);
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
    }
}