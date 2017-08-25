import * as React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';

import { FileUtils } from '../fileform/FileUtils';
import { validFileExtensions } from '../constants';
import { ApiService } from '../api';
import { FilesInputComponent } from '../fileInput/FilesInput';
// import { ButtonComponent } from '../button/Button';
// import { OneLineInformationComponent } from '../oneLineInformation/OneLineInformation';
import { FilesUploadedAction, filesUploaded } from '../actions/actions';
import { Button } from 'material-ui';
import { CircularProgress } from 'material-ui';
import { red } from 'material-ui/colors/red';

interface OwnState {
    readingFiles: boolean;
    filesRead: boolean;
    uploadingFiles: boolean;
    filesUploaded: boolean;
    folderFormError: string;
    fileNames: string[];
}

interface ConnectedDispatch {
    filesUploaded: (uploadID: number) => FilesUploadedAction;
}

export class FolderFormComponent extends React.Component<ConnectedDispatch, OwnState> {
    private filesData: ArrayBuffer[];

    constructor() {
        super();
        this.loadFile = this.loadFile.bind(this);
        this.sendFile = this.sendFile.bind(this);
        this.loadFileSocket = this.loadFileSocket.bind(this);

        this.filesData = [];
        this.state = {
            readingFiles: false,
            filesRead: false,
            uploadingFiles: false,
            filesUploaded: false,
            folderFormError: '',
            fileNames: []
        };
    }

    loadFile(files: File[]) {
        console.log("load files");
        
        let invalidFileNames: string[] = []; 
        let fileUndefined: boolean = false; 
        let filesInvalid: boolean = false; 
 
        files.forEach((file) => { 
            if (file === undefined) { 
                fileUndefined = true; 
            } else if (!FileUtils.validFile(file.name.toLowerCase(), validFileExtensions)) { 
                filesInvalid = true; 
                invalidFileNames.push(file.name); 
            } 
        }); 
 
        if (fileUndefined || filesInvalid) { 
            let errorMessage: string = fileUndefined ? 'File undefined. ' : ''; 
            errorMessage += filesInvalid ? 'Files have invalid extension: ' + invalidFileNames.join(', ') : ''; 
            this.setState({ 
                filesRead: false, 
                folderFormError: errorMessage 
            }); 
            return; 
        } 
 
        this.setState({ readingFiles: true }); 
        FileUtils.getFilesData(files).then(async (filesData: ArrayBuffer[]) => { 
            this.filesData = filesData; 
            let fileNames: string[] = files.map((file) => file.name); 
            this.setState({ 
                readingFiles: false, 
                filesRead: true, 
                fileNames: fileNames, 
                folderFormError: '', 
                filesUploaded: false 
            }); 
            await this.sendFile(); 
        }); 
    }


    async loadFileSocket(files: File[]) {
        console.log('uploading');
        
        this.setState({ uploadingFiles: true });
        await ApiService.uploadSocket(files, () => {});
        console.log("DONE");
        this.setState({ uploadingFiles: false })
    }



    async sendFile() {
        // Upload the data to the server.
        this.setState({ uploadingFiles: true });
        let resUpload = await ApiService.upload(...this.filesData);
        // After that, fetch an image.
        if (resUpload.error === false) {
            this.props.filesUploaded(resUpload.upload_id);
            this.setState({
                uploadingFiles: false,
                filesUploaded: true,
                filesRead: false,
                folderFormError: ''
            });
        } else {
            // Error if upload to the server went wrong.
            this.setState({
                uploadingFiles: false,
                filesUploaded: false,
                folderFormError: 'Error (' + resUpload.errorMessage + ') when uploading files to server.'
            });
        }

        
    }



    isSendButtonActive(): boolean {
        if (this.state.filesRead === true) {
            return true;
        } else {
            return false;
        }
    }

    getStateInformationText(): string {
        let message: string = '';
        if (this.state.readingFiles) {
            message += 'Reading files from local file system. ';
        }

        if (this.state.filesRead) {
            message += 'Files from local file system loaded. ';
        }

        if (this.state.uploadingFiles) {
            message += 'Uploading files to server. ';
        }

        if (this.state.filesUploaded) {
            message += 'Files uploaded to server.';
        }

        return message;
    }

    getFilesNames() {
        if (this.state.filesRead) {
            return this.state.fileNames.join(', ');
        } else {
            return '';
        }
    }

    getErrorInformation(): string {
        return this.state.folderFormError;
    }

    render() {
        let uploading = this.state.uploadingFiles
            ? <CircularProgress mode="indeterminate" color="#F44336" size={20} />
            : 'UPLOAD';
        return (
            <div style={{ display: 'block' }}>
                <FilesInputComponent disabled={this.state.uploadingFiles} onFilesInput={this.loadFile} />
                {uploading}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Redux.Dispatch<FilesUploadedAction>): ConnectedDispatch {
    return {
        filesUploaded: (uploadID) =>
            dispatch(filesUploaded(uploadID)),
    };
}

export const FolderForm = connect(null, mapDispatchToProps)(FolderFormComponent);
