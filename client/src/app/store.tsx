
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer, FilesState } from '../reducers/FilesReducer';
import { UIState, uiReducer } from '../reducers/UIReducer';
import { entitiesReducer } from '../reducers/EntitiesReducer';
// import { freeze } from 'redux-freeze';
import { EntitiesState } from '../reducers/EntitiesReducer';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { fetchPatients, downloadLabelsAction, initializeState } from '../actions/asyncActions';
import { Store } from 'redux';

export interface State {
    files: FilesState;
    ui: UIState;
    entities: EntitiesState;
}

const rootReducer = combineReducers({
    entities: entitiesReducer,
    files: filesReducer,
    ui: uiReducer
});

const composeEnhancers = composeWithDevTools({
    serialize: true
});

export const store = getStore();

export function getStore(): Store<{}> {

    let store: Store<{}> = createStore(rootReducer, composeEnhancers(
        applyMiddleware(thunk)
    ));

    store.dispatch(initializeState());

    return store;
}