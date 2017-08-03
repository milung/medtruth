
import * as React from 'react';

interface FilesInputProps {
    onFilesInput: (files: File[]) => void;
}

export class FilesInputComponent extends React.Component<FilesInputProps, {}> {
    render() {
        var handleFilesInputChangeEvent = (e: any) => {
            this.props.onFilesInput(Array.from(e.target.files));
        };

        return (
                <input multiple={true} type="file" name="myfile" onChange={handleFilesInputChangeEvent} />
        );
    }
}