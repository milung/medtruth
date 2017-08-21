
import * as React from 'react';

interface FilesInputProps {
    disabled: boolean;
    onFilesInput: (files: File[]) => void;
}

export class FilesInputComponent extends React.Component<FilesInputProps, {}> {

    componentDidMount(){
        let input = document.getElementById("file");
        input .setAttribute('webkitdirectory','true');
        console.log("SET TO TRUE");
        
    }
    
    render() {
        var handleFilesInputChangeEvent = (e: any) => {
            if (e.target.files.length === 0) { return; }
            this.props.onFilesInput(Array.from(e.target.files));
        };

        return (
                <input 
                    style={{display: 'none'}} 
                    multiple={true} 
                    disabled={this.props.disabled}
                    type="file" 
                    id="file"
                    onChange={handleFilesInputChangeEvent} 
                /> 
        );
    }
}