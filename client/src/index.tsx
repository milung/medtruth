
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

// tslint:disable-next-line:no-string-literal
global['$'] = require('jquery');

var config = {
    webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
        'decodeTask': {
            codecsPath: '/cornerstoneWADOImageLoaderCodecs.js'
        }
    }
};

// tslint:disable-next-line:no-string-literal
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

const root = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(
    root, 
    document.getElementById('root') as HTMLElement);
registerServiceWorker();
