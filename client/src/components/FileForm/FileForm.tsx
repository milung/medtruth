
import * as React from 'react';
import { isFileValid } from '../../utils/FileUtils';
import { validFileExtensions } from '../../constants';

export default class FileForm extends React.Component<{}, {}> {
    componentWillMount() {
        this.loadFile = this.loadFile.bind(this);
    }

    loadFile(event: any): boolean {
        const file: File = event.target.files[0] as File;
        if (!isFileValid(file.name.toLowerCase(), validFileExtensions)) { 
            return false; 
        }

        // TODO: Implement a DICOM file parser with PNG conversion.

        return true;
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.loadFile} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}