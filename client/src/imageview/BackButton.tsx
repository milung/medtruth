import * as React from 'react';
import { State } from '../app/store';
import { connect } from 'react-redux';

interface OwnProps {
    history: any;
}

export class BackButton extends React.Component<OwnProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <img
                src={require('../icons/arrow_back_black_36x36.png')}
                // style={{ float: 'left', marginTop: '10', marginLeft: '10' }}
                style={{ margin: 10, float: 'left', width: 30, height: 30 }}
                onClick={this.props.history.goBack}
            />
        )
    }
}