
import * as React from 'react';
import * as Redux from 'redux';

import { UploadDialogState, uploadDialogStateChange, filesUploaded } from "../actions/actions";
import { connect } from "react-redux";


interface FilesInputProps {
    disabled: boolean;
    isfolderForm: boolean;
    buttonId: string;
    onFilesInput: (files: File[]) => void;
}
interface ConnectedDispatch {
    filesUploaded: (uploadID: number) => null;
    changeDialogState: (state: boolean) => UploadDialogState;
}

export class FilesInputComponent extends React.Component<FilesInputProps & ConnectedDispatch, {}> {
    value: any;

     constructor(props) {
        super(props);
        this.showDialog = this.showDialog.bind(this);       
    }

    componentDidMount() {     

        if (this.props.isfolderForm) {                                   
            let input = document.getElementById(this.props.buttonId);           
           // input.setAttribute('value', "");
            input.setAttribute('webkitdirectory', 'true');
        }

    }
     showDialog() {
        this.props.changeDialogState(true);
    }

    render() {
        var handleFilesInputChangeEvent = (e: any) => {
            console.log("CHANGE", e.target.value)
            if (e.target.files.length === 0) {
                this.showDialog();                
                return;
             }
           // this.props.onFilesInput([]);
            this.props.onFilesInput(Array.from(e.target.files));
        };

        // var handleClick = (e: any) => {       
        //    e.target.value = 'C:\fakepath\MR000010.dcm';        
        // };
        

        return (
            <input
                style={{ display: 'none' }}
                multiple={true}
                disabled={this.props.disabled}
                type="file"
                id={this.props.buttonId}
                onChange={handleFilesInputChangeEvent}                   
               
            />
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<UploadDialogState>): ConnectedDispatch {
    return {
          filesUploaded: (uploadID) => null,
         changeDialogState: (show: boolean) => dispatch(uploadDialogStateChange(show))
    };
}

export  const FilesInput =  connect<{}, {}, FilesInputProps>(null, mapDispatchToProps) (FilesInputComponent);