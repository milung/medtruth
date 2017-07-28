
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer } from '../reducers/FilesReducer';
import { imagesReducer } from '../reducers/ImagesReducer';

const ReduxDevTool = composeWithDevTools;
const rootReducer = combineReducers({
    files: filesReducer,
    images: imagesReducer
});
export const store = createStore(rootReducer, ReduxDevTool());
