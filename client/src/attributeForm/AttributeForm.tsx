
import * as React from 'react';
//import { TextField } from 'C:/Users/USER/Desktop/31.07.2017/SDA-GroundTruth/client/src/attributeForm/TextFields.tsx';
import { TextFields } from './TextFields';
import Grid from 'material-ui/Grid';

export class AttributeForm extends React.Component<{}, {}> {


  render() {

    return (
      <div>
        <Grid item xs={12} sm={12} md={12}>
          {"Key"}
          <TextFields />
          <p/>
          {"Value"}
          <TextFields />
          <p/>
          <button type="submit">Assign</button>
          <p/>
        </Grid>
      </div>
    );
  }
}
