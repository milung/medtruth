
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
//import registerServiceWorker from './registerServiceWorker';

const root = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(
    root, 
    document.getElementById('root') as HTMLElement);
//registerServiceWorker();
