
import { State } from '../app/store';
import { ImageEntity, SeriesEntity, StudyEntity, PatientEntity, EntitiesState } from '../reducers/EntitiesReducer';


// get all
export const getImages = (state: State) => {
    return state.entities.images.byId;
};

export const getSeries = (state: State) => {
    return state.entities.series.byId;
};

export const getStudies = (state: State) => {
    return state.entities.studies.byId;
};

export const getPatients = (state: State) => {
    return state.entities.patients.byId;
};

// get one where id
export const getImageWhereId = (state: State, id: string): ImageEntity => {
    return getImages(state).get(id);
};

export const getSeriesWhereId = (state: State, id: string): SeriesEntity => {
    return getSeries(state).get(id);
};

export const getStudyWhereId = (state: State, id: string): StudyEntity => {
    return getStudies(state).get(id);
};

export const getPatientWhereId = (state: State, id: string): PatientEntity => {
    return getPatients(state).get(id); 
};

// get all where ids
export const getImagesWhereId = (state: State, ids: string[]): ImageEntity[] => {
    let images: ImageEntity[] = [];
    let imageMap: Map<string, ImageEntity> = getImages(state);
    ids.forEach(imageId => {
        let image: ImageEntity = imageMap.get(imageId);
        if (image) {
            images.push(image);
        }
    });
    return images;
};

export const getSeriesesWhereId = (state: State, ids: string[]): SeriesEntity[] => {
    let serieses: SeriesEntity[] = [];
    let seriesMap: Map<string, SeriesEntity> = getSeries(state);
    ids.forEach(seriesId => {
        let series: SeriesEntity = seriesMap.get(seriesId);
        if (series) {
            serieses.push(series);
        }
    });
    return serieses;
};

export const getStudiesWhereId = (state: State, ids: string[]): StudyEntity[] => {
    let studies: StudyEntity[] = [];
    let studiesMap: Map<string, StudyEntity> = getStudies(state);
    ids.forEach(studyId => {
        let study: StudyEntity = studiesMap.get(studyId);
        if (study) {
            studies.push(study);
        }
    });
    return studies;
};

export const getPatientsWhereId = (state: State, ids: string[]): PatientEntity[] => {
    let patients: PatientEntity[] = [];
    let patientMap: Map<string, PatientEntity> = getPatients(state);
    ids.forEach(patientId => {
        let patient: PatientEntity = patientMap.get(patientId);
        if (patient) {
            patients.push(patient);
        }
    });
    return patients;
};

//
export const getStudiesWherePatientId = (state: State, patientId: string): StudyEntity[] => {
    let patient: PatientEntity = getPatientWhereId(state, patientId);
    return getStudiesWhereId(state, patient.studies);
}; 

export const getSeriesesWhereStudyId = (state: State, studyId: string): SeriesEntity[] => {
    let study: StudyEntity = getStudyWhereId(state, studyId);
    return getSeriesesWhereId(state, study.series);
};

export const getImagesWhereSeriesId = (state: State, seriesId: string): ImageEntity[] => {
    let series: SeriesEntity = getSeriesWhereId(state, seriesId);
    return getImagesWhereId(state, series.images);
};
