
export const FILE_CHANGED = 'FILE_CHANGED';

export interface FileFormAction {
    type: string,
    valid: boolean
}

export const fileChanged = (valid: boolean): FileFormAction => ({
    type: FILE_CHANGED,
    valid
});
