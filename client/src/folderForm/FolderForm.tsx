
import * as React from 'react';
// import * as Redux from 'redux';
// import { connect } from 'react-redux';
import * as axios from 'axios';

// import { FileFormAction, fileChanged } from './FileFormActions';
import { FileUtils } from '../FileUtils';
import { validFileExtensions } from '../constants';
import { ApiService } from '../api';

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
            folderFormError: ''
        };
    }

    loadFile(event: any): void {
        const files: File[] = event.target.files;

        for (let ind = 0; ind < files.length; ind++) {
            let file = files[ind];
            if (file === undefined) {
                this.setState({
                    folderFormState: folderFormStates.ERROR,
                    folderFormError: 'File ' + file.name + 'is undefined.'
                });
                return;
            }
        }

        for (let ind = 0; ind < files.length; ind++) {
            let file = files[ind];
            if (!FileUtils.validFile(file.name.toLowerCase(), validFileExtensions)) {
                this.setState({
                    folderFormState: folderFormStates.ERROR,
                    folderFormError: 'File ' + file.name + ' has invalid extension.'
                });
                return;
            }
        }

        this.setState({ folderFormState: folderFormStates.READING_FILES });

        FileUtils.getFilesData(files).then((filesData: ArrayBuffer[]) => {
            this.filesData = filesData;
            this.setState({ folderFormState: folderFormStates.FILES_READ });
        });
    }

    sendFile(): void {
        // Upload the data to the server.
        this.setState({ folderFormState: folderFormStates.UPLOADING_FILES });
        ApiService.upload(...this.filesData)
            .then((resUpload: axios.AxiosResponse) => {
                // After that, fetch an image.
                this.setState({
                    folderFormState: folderFormStates.FILES_UPLOADED
                });
            })
            .catch((resUploadErr: axios.AxiosError) => {
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
                <input type="file" onChange={this.loadFile} multiple={true} />
                <button
                    onClick={this.sendFile}
                    disabled={!this.isSendButtonActive()}
                >
                    {'Send'}
                </button>
                <p>{this.getStateInformationText()}</p>
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
