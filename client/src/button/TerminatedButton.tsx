import * as React from 'react';
import * as Redux from 'redux';
import { ButtonComponent } from './Button';
import { ApiService } from '../api';
// import DeleteIcon from 'material-ui-icons/Delete';
import Icon from 'material-ui/Icon';
import { connect } from 'react-redux';
import { deleteDialogStateChange, TerminatedDialogPopup, terminatedPopupStateChange } from '../actions/actions';
import FailedIcon from 'material-ui-icons/SmsFailed';
import { State } from "../app/store";

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => TerminatedDialogPopup;
}

interface ConnectedState {
    disabled: boolean;
}


class TerminatedButtonComponent extends React.Component<ConnectedState & ConnectedDispatch, {}> {
    constructor() {
        super();
        this.showDialog = this.showDialog.bind(this);
    }



    componentDidMount(){
        console.log("componentDidMount TerminatedButtonComponent");
    }

    componentWillUpdate(nextProps, nextState){
        console.log("componentWillUpdate");
    }

    showDialog() {;
        console.log(this.props.disabled);
        if(!this.props.disabled){
            this.props.changeDialogState(true);
        }
        
    }

    render() {
        return (
            <div>
                <a
                    onClick={this.showDialog}
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                    <FailedIcon/>
                </a>
            </div>
        );
    }
}

function mapStateToProps(state: State): ConnectedState {
    return {
        disabled: state.ui.terminatedUploads.length <= 0 
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<TerminatedDialogPopup>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(terminatedPopupStateChange(show)),
    };
}

export const TerminatedButton = connect(mapStateToProps, mapDispatchToProps)(TerminatedButtonComponent);