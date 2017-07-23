
import { FileFormReducer } from '../fileform/FileFormReducer';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const ReduxDevTool = composeWithDevTools;
export const store = createStore(FileFormReducer, ReduxDevTool());
