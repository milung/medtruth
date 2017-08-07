import * as React from 'react';
//import { TextField } from 'C:/Users/USER/Desktop/31.07.2017/SDA-GroundTruth/client/src/attributeForm/TextFields.tsx';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

export interface listItem {
    attribute: string;
    value: number;
};
export interface listOfAttributes {
    listItems: listItem[];
};

export class AttributeList extends React.Component<listOfAttributes, {}> {
    constructor(props) {
        super(props);
        // this.props.listItems=props.listItems;
        console.log(this.props.listItems[2])
    }

    render() {
        console.log("overflow auto changed");
        return (
            <div>
                <Paper style={{maxHeight: '65vh', overflowY: 'auto', width: '100%'}}>
                <Table bodyStyle={{height: 'inherit', overflowX: 'auto'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Label </TableCell>
                            <TableCell numeric>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.props.listItems.map((item, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        {item.attribute}
                                    </TableCell>
                                    <TableCell numeric>
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
    }
}