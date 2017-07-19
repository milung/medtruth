
export const FILE_CHANGED = 'FILE_CHANGED';

export interface FileFormAction {
    type: string;
    valid: boolean;
    imageID: string;
}

export const fileChanged = (valid: boolean, imageID: string): FileFormAction => ({
    type: FILE_CHANGED,
    valid,
    imageID
});
