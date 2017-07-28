
import * as React from 'react';
import * as Redux from 'redux';
import { FileUtils } from '../fileform/FileUtils';
import { validFileExtensions } from '../constants';
import { ApiService } from '../api';
import { FilesInputComponent } from '../fileInput/FilesInput';
import { ButtonComponent } from '../button/Button';
import { OneLineInformationComponent } from '../oneLineInformation/OneLineInformation';
import { connect } from 'react-redux';
import { FilesUploadedAction, filesUploaded } from '../actions/actions';

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

    loadFile(files: File[]): void {
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
        FileUtils.getFilesData(files).then((filesData: ArrayBuffer[]) => {
            this.filesData = filesData;
            let fileNames: string[] = files.map((file) => file.name);
            this.setState({
                readingFiles: false,
                filesRead: true,
                fileNames: fileNames,
                folderFormError: '',
                filesUploaded: false
            });
        });
    }

    async sendFile(): Promise<void> {
        // Upload the data to the server.
        this.setState({ uploadingFiles: true });
        let resUpload = await ApiService.upload(...this.filesData);
        // After that, fetch an image.
        if (resUpload.statuses[0].err === null) {
            this.props.filesUploaded(122333);
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
                folderFormError: 'Error (' + resUpload.statuses[0].err + ') when uploading files to server.'
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
        return (
            <div>
                <FilesInputComponent onFilesInput={this.loadFile} />
                <ButtonComponent active={this.isSendButtonActive()} onClick={this.sendFile} text="Send" />
                <OneLineInformationComponent text={this.getStateInformationText()} />
                <OneLineInformationComponent text={this.getFilesNames()} />
                <OneLineInformationComponent text={this.getErrorInformation()} />
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
