
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer } from '../reducers/FilesReducer';

const ReduxDevTool = composeWithDevTools;
const rootReducer = combineReducers({
    files: filesReducer 
});

export interface State {
    files: {
        lastUploadID: number;
    };
}
export const store = createStore(rootReducer, ReduxDevTool());
