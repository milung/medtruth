
import * as React from 'react';
import { VisibleFileForm } from '../fileform/FileForm';
import { ImageView } from '../ImgeView/ImageView';

// const App: React.StatelessComponent<{}> = () => (
//     <div>
//         <VisibleFileForm />
//         <div style={{ width: 512, height: 512, top: 0, left: 0 }} id="dicomImage" />
//     </div>
// );

// export default App;

export default class App extends React.Component<{}, {}> {
    render() {
        return (
        <div>
            <VisibleFileForm />
            <ImageView />
        </div>);
    }
}
