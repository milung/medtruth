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

export interface State {
    keyFieldValue: string,
    valueFieldValue: string
}

export class AttributeForm extends React.Component<{}, State> {

    constructor() {
        super();

        this.state = {
            keyFieldValue: '',
            valueFieldValue: ''
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyFieldChange = this.handleKeyFieldChange.bind(this);
        this.handleValueFieldChange = this.handleValueFieldChange.bind(this);
    }

    handleClick() {
        console.log("Assign; Fields", this.state.keyFieldValue + ": " + this.state.valueFieldValue);
    }

    handleKeyFieldChange(e) {
        this.setState({
            keyFieldValue: e.target.value
        }, () => {
            console.log("new key", this.state.keyFieldValue);
        });
    }

    handleValueFieldChange(e) {
        this.setState({
            valueFieldValue: e.target.value
        }, () => {
            console.log("new value", this.state.valueFieldValue);
        });
    }

    render() {
        var inputIncorrect;
        
        // Check if value field is in between 0 and 1
        let valueNumber = Number(this.state.valueFieldValue);
        (valueNumber >= 0 && valueNumber <= 1) ? inputIncorrect = false : inputIncorrect = true;

        // Check if key field is empty
        let keyValue = this.state.keyFieldValue;
        if (keyValue == null || keyValue.trim() == "") {
            inputIncorrect = true;
        }

        console.log("RENDER");   
        return (
            <div >
                {/* <Paper> */}
                <Grid item xs={12} sm={12} md={12}>
                    <div>
                        <TextField
                            required
                            error={inputIncorrect}
                            id="keyField"
                            label="Key"
                            margin="normal"
                            style={{ width: '100%' }}
                            value={this.state.keyFieldValue}
                            onChange={this.handleKeyFieldChange}
                        />
                        <TextField
                            error={inputIncorrect}
                            id="valueField"
                            label="Value"
                            margin="normal"
                            style={{ width: '100%' }}
                            value={this.state.valueFieldValue}
                            onChange={this.handleValueFieldChange}
                        />
                        <p />
                        <Button disabled={inputIncorrect} id="assignButton" type="submit" raised color="primary" onClick={this.handleClick.bind(this)} style={{ float: "right" }}>Assign</Button>
                    </div>

                    <AttributeList listItems={testData} />
                </Grid>
                {/* </Paper> */}
            </div>);
    }
}
