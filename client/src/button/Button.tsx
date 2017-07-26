import * as React from 'react';

interface ButtonProps {
    onClick: () => void;
    active: boolean;
    text: string;
}

export class ButtonComponent extends React.Component<ButtonProps, {}> {
    render() {
        return (
            <button
                    onClick={this.props.onClick}
                    disabled={!this.props.active}
            >
            {this.props.text}
            </button>
        );
    }
}