import * as React from 'react';
//import { TextField } from 'C:/Users/USER/Desktop/31.07.2017/SDA-GroundTruth/client/src/attributeForm/TextFields.tsx';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
// import Paper from 'material-ui/Paper';

interface listItem {
    atribute: string;
    value: number;
};
interface listOfAttributes {
    listItems: listItem[];
};

export class AttributeList extends React.Component<listOfAttributes, {}> {
    constructor(props) {
        super(props);
        // this.props.listItems=props.listItems;
        console.log(this.props.listItems[2])
    }

    render() {
        return (
            <div>
                {/* <Paper> */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Dessert </TableCell>
                            <TableCell numeric>Calories</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.listItems.map((item, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>
                                        {item.atribute}
                                    </TableCell>
                                    <TableCell numeric>
                                        {item.value}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {/* </Paper> */}
            </div>
        );
    }
}