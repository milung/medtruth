
import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { filesReducer, FilesState } from '../reducers/FilesReducer';
import { UIState, uiReducer } from '../reducers/UIReducer';
import { entitiesReducer } from '../reducers/EntitiesReducer';
// import { freeze } from 'redux-freeze';
import { EntitiesState } from '../reducers/EntitiesReducer';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import { fetchPatients, downloadLabelsAction, downloadImageAnnotations } from '../actions/asyncActions';
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

    initializeState(store);

    return store;
}

async function initializeState(store: Store<{}>) {
    let patients = await store.dispatch(fetchPatients());

    let imageIds: string[] = [];
    patients.forEach(patient => {
        patient.studies.forEach(study => {
            study.series.forEach(series => {
                series.images.forEach(image => {
                    imageIds.push(image.imageID);
                });
            });
        });
    });

    await store.dispatch(downloadImageAnnotations(...imageIds));

    await store.dispatch(downloadLabelsAction());
}