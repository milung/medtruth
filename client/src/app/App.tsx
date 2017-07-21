
import * as React from 'react';
import { FileForm } from '../fileform/FileForm';
import { ImageView } from '../ImgeView/ImageView';

export default class App extends React.Component<{}, {}> {
    render() {
        return (
        <div>
            <FileForm />
            <ImageView />
        </div>);
    }
}
