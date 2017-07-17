
import * as React from 'react';

export default class FileForm extends React.Component<{}, {}> {
    constructor(props: React.Props<{}>) {
        super();
        this.onChange = this.onChange.bind(this);
    }

    onChange(event: any) {
        
    }

    render() {
        return (
            <form>
                <input type="file" />
                <input type="submit" value="Submit" onChange={this.onChange}/>
            </form>
        );
    }
}