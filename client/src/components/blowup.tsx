
import * as React from 'react';

interface OwnProps {
}

interface OwnState {

}


export class BlowUpComponent extends React.Component<OwnProps, OwnState>{
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <img src="https://pbs.twimg.com/profile_images/696496865416716289/2IUmoQNo.jpg" />
            </div>
        );
    }
}

