
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

import { State } from '../app/store';
import { SeriesAllUnselectedAction, seriesAllUnselected } from '../actions/actions';

export interface ConnectedState {
    images: string[];
}

export interface ConnectedDispatch {
    unselectAll: () => SeriesAllUnselectedAction;
}

export class SelectionStatusComponent extends React.Component<ConnectedState & ConnectedDispatch, {}> {
    constructor(props) {
        super(props);
        this.unselectAll = this.unselectAll.bind(this);
    }

    render() {
        let display = this.props.images.length === 0 ? false : true;
        let selected = 'Selected ' + this.props.images.length + ' images';
        let action = 'UNSELECT';
        return (
            <Snackbar
                open={display} 
                action={<button
                        type="submit"
                        role="button"
                        style={{
                            color: '#e53c76', 
                            fontWeight: 'bold', 
                            background: 'none', 
                            outline: 'none', 
                            border: 'none', 
                            cursor: 'pointer'}} 
                        onClick={this.unselectAll}>
                            {action}
                        </button>}
                message={selected} 
            />
        );
    }

    private unselectAll(e: object): void {
        this.props.unselectAll();
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        images: state.ui.selections.series
    };
}

function mapDispatchToProps(dispatch: Dispatch<SeriesAllUnselectedAction>): ConnectedDispatch {
    return {
        unselectAll: () => dispatch(seriesAllUnselected())
    };
}

export const SelectionStatus = connect(mapStateToProps, mapDispatchToProps)(SelectionStatusComponent);
