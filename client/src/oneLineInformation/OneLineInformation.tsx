import * as React from 'react';

interface OneLineInformationProps {
    text: string;
}

export class OneLineInformationComponent extends React.Component<OneLineInformationProps, {}> {
    render() {
        return (
            <p>{this.props.text}</p>
        );
    }
}