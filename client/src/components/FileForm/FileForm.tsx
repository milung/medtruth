
import * as React from 'react';

const validExtensions: [string] = ['.dcm', '.ima'];

export default class FileForm extends React.Component<{}, {}> {
    constructor(props: React.Props<{}>) {
        super();
        this.onChange = this.onChange.bind(this);
    }

    onChange(event: any): boolean {
        const file: File = event.target.files[0];
        if (!this.isFileValid(file.name)) { return false; }
        return true;
    }

    isFileValid(filename: string): boolean {
        let valid: boolean = false;
        validExtensions.forEach((val: string) => {
            if (filename.toLowerCase().endsWith(val)) { valid = true; }
        });
        return valid
    }

    render() {
        return (
            <form>
                <input type="file" onChange={this.onChange} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}