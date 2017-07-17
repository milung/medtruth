
import * as React from 'react';

export default class FileForm extends React.Component<{}, {}> {
    onChange(event: Event) {

    }

    render() {
        return (
            <form>
                <input type="file" />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}