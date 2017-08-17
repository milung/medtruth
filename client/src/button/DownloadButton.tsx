
import * as React from 'react';

import { ButtonComponent } from './Button';
import { ApiService } from '../api';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { DownloadStatePopup, downloadPopupStateChange } from '../actions/actions';

interface ConnectedDispatch {
    changeDialogState: (state: boolean) => DownloadStatePopup;
}
class DownloadButtonComponent extends React.Component<ConnectedDispatch, {}> {
    constructor() {
        super();
        this.showDialog = this.showDialog.bind(this);
    }

    async download() {
        let data = await ApiService.getDownload();
    }

    showDialog() {
        this.props.changeDialogState(true);
    }

    render() {
        return (
            // tslint:disable-next-line:jsx-boolean-value
            <a
                onClick={this.showDialog}
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
                DOWNLOAD
            </a>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<DownloadStatePopup>): ConnectedDispatch {
    return {
        changeDialogState: (show: boolean) => dispatch(downloadPopupStateChange(show)),
    };
}

export const DownloadButton = connect(null, mapDispatchToProps)(DownloadButtonComponent);