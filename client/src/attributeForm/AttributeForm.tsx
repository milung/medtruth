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
let testData=[line1,line2,line3];

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
            <div>
                <Grid item xs={12} sm={12} md={12}>
                    {"Key"}
                    <input id="key" type="text" />
                    <p />
                    {"Value"}
                    <input id="value" type="text" />
                    <p />
                    <button type="submit" onClick={this.handleClick.bind(this)}>Assign</button>
                    <p />
                </Grid>
            </div>
        );
    }
}
