
import { State } from '../app/store';
import { ImageEntity, SeriesEntity, StudyEntity, PatientEntity } from '../reducers/EntitiesReducer';

export const getImageById = (state: State, id: string): ImageEntity => {
    return state.entities.images.byId.get(id);
};

export const getSeriesById = (state: State, id: string): SeriesEntity => {
    return state.entities.series.byId.get(id);
};

export const getStudyById = (state: State, id: string): StudyEntity => {
    return state.entities.studies.byId.get(id);
};

export const getPatientById = (state: State, id: string): PatientEntity => {
    return state.entities.patients.byId.get(id);
};

// get ids

export const getImagesIds = (state: State): string[] => {
    return Array.from(state.entities.images.byId.keys());
};

export const getSeriesIds = (state: State): string[] => {
    return Array.from(state.entities.series.byId.keys());
};

export const getStudiesIds = (state: State): string[] => {
    return Array.from(state.entities.studies.byId.keys());
};

export const getPatientsIds = (state: State): string[] => {
    return Array.from(state.entities.patients.byId.keys());
};
