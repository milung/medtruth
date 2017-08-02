import * as React from 'react';
//import { TextField } from 'C:/Users/USER/Desktop/31.07.2017/SDA-GroundTruth/client/src/attributeForm/TextFields.tsx';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
// import Paper from 'material-ui/Paper';
let id = 0;
function createData(name, calories) {
    id += 1;
    return { id, name, calories };
}
const data = [
    createData('Frozen yoghurt', 159),
    createData('Ice cream sandwich', 237),
    createData('Eclair', 262),
    createData('Cupcake', 305),
    createData('Gingerbread', 356),
    createData('Frozen yoghurt', 159),
    createData('Ice cream sandwich', 237),
    createData('Eclair', 262),
    createData('Cupcake', 305),
    createData('Gingerbread', 356),
    createData('Frozen yoghurt', 159),
    createData('Ice cream sandwich', 2373),
];
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
    public createData(name, calories) {
        id += 1;
        return { id, name, calories };
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
                            {data.map(n => {
                                return (
                                    <TableRow key={n.id}>
                                        <TableCell>
                                            {n.name}
                                        </TableCell>
                                        <TableCell numeric>
                                            {n.calories}
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