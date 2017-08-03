
import * as React from 'react';
import { AttributeForm } from '../attributeForm/AttributeForm';
import Grid from 'material-ui/Grid';
import { Content } from '../components/content';

var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

export default class App extends React.Component<{}, {}> {
    render() {
        return (
        <div>
            <Grid container={true}>
                <Grid item xs={9} sm={9} md={9}>
                   <Content/>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                    <AttributeForm />
                </Grid>
            </Grid>
        </div>
        );
    }
}
