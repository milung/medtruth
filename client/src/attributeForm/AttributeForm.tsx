import * as React from 'react';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
//import Card, { CardContent } from 'material-ui/Card';
import { AttributeList } from "./AttributeList";
// import Paper from 'material-ui/Paper';

let line1 = { atribute: "ruka", value: 2 };
let line2 = { atribute: "ruka", value: 2 };
let line3 = { atribute: "ruka", value: 2 };
let testData = [line1, line2, line3];

export class AttributeForm extends React.Component<{}, {}> {

    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("Assign was clicked!");
    }

    render() {
        return (
            <div >
                {/* <Paper> */}
                <Grid item xs={12} sm={12} md={12}>
                    <div>
                        <TextField
                            id="key"
                            label="Key"
                            margin="normal"
                            style={{ width: '100%' }}
                        />
                        <TextField
                            id="value"
                            label="Value"
                            type="number"
                            margin="normal"
                            style={{ width: '100%' }}
                        />
                        <p />
                        <Button type="submit" raised color="primary" style={{ float: "right" }}>Assign</Button>
                    </div>

                    <AttributeList listItems={testData} />
                </Grid>
                {/* </Paper> */}
            </div>);
    }
}
