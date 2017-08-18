
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer, FilesState } from '../reducers/FilesReducer';
import { UIState, uiReducer } from '../reducers/UIReducer';
import { entitiesReducer } from '../reducers/EntitiesReducer';
// import { freeze } from 'redux-freeze';
import { EntitiesState } from '../reducers/EntitiesReducer';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { fetchPatients, downloadLabelsAction } from "../actions/asyncActions";

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

const composeEnhancers = composeWithDevTools({
    serialize: true
});

export const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

store.dispatch(fetchPatients());
store.dispatch(downloadLabelsAction());