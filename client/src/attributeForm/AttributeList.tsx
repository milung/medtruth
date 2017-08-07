
import * as React from 'react';
//import { TextField } from 'C:/Users/USER/Desktop/31.07.2017/SDA-GroundTruth/client/src/attributeForm/TextFields.tsx';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import { ApiService } from "../api";

export interface listItem {
    attribute: string;
    value: number;
};
export interface listOfAttributes {
    listItems: listItem[];
    selection: string[];
};

export interface listState {
    activeCheckboxes: string[];
    //values: number[]
}

export class AttributeList extends React.Component<listOfAttributes, listState> {
    constructor(props) {
        super(props);
        // this.props.listItems=props.listItems;
        console.log(this.props.listItems[2]);
        //this.handleChange = this.handleChange.bind(this);
        var active: string[] = [];
        var inactive: string[] = [];
        //var helperValues: number[] = [];
        for (var item of this.props.listItems) {
            console.log("attribute " + item.attribute + " " + item.value);
            if (item.value > 0) {
                active.push(item.attribute);
                //helperValues.push(item.value);
            } 
            // else {
            //     inactive.push(item.attribute);
            // }

            //item.value > 0 ? helperChecked.push(true) : helperChecked.push(false);
            //helperValues.push(item.value);
        }
        console.log(this.props.listItems);
        this.state = {
            activeCheckboxes: active,
            //values: helperValues
        }
        // console.log(this.state.activeCheckboxes);
        // console.log(inactive);
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
                                            <Checkbox checked={this.state.activeCheckboxes.indexOf(item.attribute) >= 0}
                                                indeterminate={false}
                                                onChange={async (event: object, checked: boolean) => {
                                                    console.log(item.attribute);
                                                    var checkAdded = false;

                                                    if (this.state.activeCheckboxes.indexOf(item.attribute) >= 0) {
                                                        // Uncheck
                                                        this.setState({
                                                            activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== item.attribute)
                                                        }); 
                                                    } else {
                                                        // Check
                                                        this.setState({
                                                            activeCheckboxes: this.state.activeCheckboxes.concat(item.attribute)
                                                        }); 
                                                        checkAdded = true;
                                                    }

                                                    for (var img of this.props.selection) {
                                                        console.log(img, item.attribute, checkAdded);
                                                        await ApiService.putAttributes(img, { key: item.attribute, value: checkAdded ? 1 : 0 });
                                                    }
                                                }}
                                            />
                                            {item.attribute}
                                        </TableCell>
                                        <TableCell >
                                            {this.state.activeCheckboxes.indexOf(item.attribute) >= 0 ? 1 : 0}
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