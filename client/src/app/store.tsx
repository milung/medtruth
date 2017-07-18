
import { fileFormReducer } from '../fileform/FileFormReducer';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

export const store = createStore(fileFormReducer, composeWithDevTools());
