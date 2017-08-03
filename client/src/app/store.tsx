
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer, FilesState } from '../reducers/FilesReducer';
import { UIState, uiReducer } from '../reducers/UIReducer';
import { entitiesReducer, EntitiesState } from '../reducers/EntitiesReducer';
//import { EntitiesState } from '../reducers/EntitiesReducer';

const ReduxDevTool = composeWithDevTools;
const rootReducer = combineReducers({
    entities: entitiesReducer,
    files: filesReducer,
    ui: uiReducer
});

export interface State {
    files: FilesState;
    ui: UIState;
    entities: EntitiesState;
}
export const store = createStore(rootReducer, ReduxDevTool());
