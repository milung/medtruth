
import * as React from 'react';
// import * as Redux from 'redux';
// import { connect } from 'react-redux';

// import { FileFormAction, fileChanged } from './FileFormActions';
import { FileUtils } from '../fileform/FileUtils';
import { validFileExtensions } from '../constants';
import { ApiService } from '../api';
import { FilesInputComponent } from '../fileInput/FilesInput';
import { ButtonComponent } from '../button/Button';
import { OneLineInformationComponent } from '../oneLineInformation/OneLineInformation';

var folderFormStates = {
    INITIAL_STATE: 0,
    READING_FILES: 1,
    FILES_READ: 2,
    UPLOADING_FILES: 3,
    FILES_UPLOADED: 4,
    ERROR: 5
};

interface OwnState {
    folderFormState: number;
    folderFormError: string;
    fileNames: string[];
}

// interface ConnectedDispatch {
//     change: (valid: boolean, imageID: string) => FolderFormAction;
// }

export class FolderFormComponent extends React.Component<{}, OwnState> {
    private filesData: ArrayBuffer[];

    constructor() {
        super();
        this.loadFile = this.loadFile.bind(this);
        this.sendFile = this.sendFile.bind(this);
        this.filesData = [];
        this.state = {
            folderFormState: folderFormStates.INITIAL_STATE,
            folderFormError: '',
            fileNames: []
        };
    }

    loadFile(files: File[]): void {
        files.forEach((file) => {
            if (file === undefined) {
                this.setState({
                    folderFormState: folderFormStates.ERROR,
                    folderFormError: 'File ' + file.name + 'is undefined.'
                });
                return;
            }
            if (!FileUtils.validFile(file.name.toLowerCase(), validFileExtensions)) {
                this.setState({
                    folderFormState: folderFormStates.ERROR,
                    folderFormError: 'File ' + file.name + ' has invalid extension.'
                });
                return;
            }
        });

        this.setState({ folderFormState: folderFormStates.READING_FILES });

        FileUtils.getFilesData(files).then((filesData: ArrayBuffer[]) => {
            this.filesData = filesData;
            let fileNames: string[] = files.map((file) => file.name);
            this.setState({ folderFormState: folderFormStates.FILES_READ, fileNames: fileNames });
        });
    }

    sendFile(): void {
        // Upload the data to the server.
        this.setState({ folderFormState: folderFormStates.UPLOADING_FILES });
        ApiService.upload(...this.filesData)
            .then((resUpload) => {
                // After that, fetch an image.
                this.setState({
                    folderFormState: folderFormStates.FILES_UPLOADED
                });
            })
            .catch((resUploadErr) => {
                // Error if upload to the server went wrong.
                this.setState({
                    folderFormState: folderFormStates.ERROR,
                    folderFormError: 'Error (' + resUploadErr.message + ') when uploading files to server.'
                });
            });
    }

    isSendButtonActive(): boolean {
        if (this.state.folderFormState === folderFormStates.FILES_READ) {
            return true;
        } else {
            return false;
        }
    }

    getStateInformationText(): string {
        switch (this.state.folderFormState) {
            case folderFormStates.INITIAL_STATE:
                return '';
            case folderFormStates.READING_FILES:
                return 'Reading files from local file system.';
            case folderFormStates.FILES_READ:
                return 'Files from local file system loaded.';
            case folderFormStates.UPLOADING_FILES:
                return 'Uploading files to server.';
            case folderFormStates.FILES_UPLOADED:
                return 'Files uploaded to server.';
            case folderFormStates.ERROR:
                return 'Error: ' + this.state.folderFormError;
            default:
                return 'Unknown state.';
        }
    }

    render() {
        return (
            <div>
                <FilesInputComponent onFilesInput={this.loadFile} />
                <ButtonComponent active={this.isSendButtonActive()} onClick={this.sendFile} text="Send" />
                <OneLineInformationComponent text={this.state.fileNames.join(', ')} />
                <OneLineInformationComponent text={this.getStateInformationText()} />
            </div>
        );
    }
}

// function mapDispatchToProps(dispatch: Redux.Dispatch<FolderFormAction>): ConnectedDispatch {
//     return {
//         change: (valid: boolean, imageID: string) =>
//             dispatch(fileChanged(valid, imageID)),
//     };
// }

// export const FolderForm = connect(null, mapDispatchToProps)(FileFormComponent);
