
export namespace FileUtils {
    export const validFile = (filename: string, extensions: [string]): boolean => {
        let valid: boolean = false;
        extensions.forEach((val: string) => {
            if (filename.endsWith(val)) {
                valid = true;
                return;
            }
        });
        return valid;
    };

    export const getFilesData = (files: File[]): Promise<ArrayBuffer[]> => {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            var index: number = 0;
            var filesData: ArrayBuffer[] = [];

            function process_one() {
                if (index >= files.length) {
                    resolve(filesData);
                    return;
                }
                var file = files[index];
                index++;
                reader.onload = (e: any) => {
                    if (e.target.error !== null) {
                        reject("Error while reading file " + file.name);
                        return;
                    }
                    filesData.push(e.target.result);
                    process_one();
                };
                reader.readAsArrayBuffer(file);
            }

            process_one();
        });
    };


}
