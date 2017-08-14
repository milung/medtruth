
import * as React from 'react';

import { ButtonComponent } from './Button';
import { ApiService } from '../api';

export class DownloadButton extends React.Component<{}, {}> {
    constructor() {
        super();
        this.download = this.download.bind(this);
    }

    async download() {
        let data = await ApiService.getDownload();
    }

    render() {
        return (
            // tslint:disable-next-line:jsx-boolean-value
            <a
                href="/api/download"
                download
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >DOWNLOAD
            </a>
        );
    }
}
