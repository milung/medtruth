
import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../app/store';

export interface ConnectedState {
    imagesSize: number;
}

export class SelectionStatusComponent extends React.Component<ConnectedState, {}> {
    render() {
        let display = this.props.imagesSize === 0 ? 'none' : 'block';
        return (
            // tslint:disable-next-line:jsx-alignment
            <div style={
                {display: display, 
                backgroundColor: '#37f226', 
                position: 'fixed',
                bottom: '0px',
                height: 'auto',
                width: '100%',
                maxWidth: 'inherit'}}
            >
                <p style={{ color: 'white', fontFamily: 'Roboto' }}>
                    Selected: {this.props.imagesSize}
                </p>
            </div>
        );
    }
};

function mapStateToProps(state: State): ConnectedState {
    return {
        imagesSize: state.ui.selections.series.size
    };
}

export const SelectionStatus = connect(mapStateToProps, null)(SelectionStatusComponent);
