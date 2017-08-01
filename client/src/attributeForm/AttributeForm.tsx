import * as React from 'react';
import Grid from 'material-ui/Grid';

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
