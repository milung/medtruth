
import * as React from 'react';

import { ButtonComponent } from './Button';
import { ApiService } from '../api';

export class DownloadImgMapButton extends React.Component<{}, {}> {
    constructor() {
        super();
        this.download = this.download.bind(this);
    }

    async download() {
        let data = await ApiService.getDownloadImgMap();
    }

    render() {
        return (
            // tslint:disable-next-line:jsx-boolean-value
            <a
                href="/api/download/img_map"
                download
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >IMG_MAP
            </a>
        );
    }
}
