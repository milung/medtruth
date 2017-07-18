
export const isFileValid = (filename: string, extensions: [string]): boolean => {
    let valid: boolean = false;
    extensions.forEach((val: string) => {
        if (filename.endsWith(val)) { 
            valid = true; 
            return; 
        }
    });
    return valid;
};
