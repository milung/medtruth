import { UploadJSON, StudyJSON, SeriesJSON, ImageJSON } from "../Objects";

export namespace Merger {
    export const patientsMerger = (patients: {}, uploads: UploadJSON[]) => {
        var newPatient = patients;
        for (var i = 0; i < uploads.length; i++) {
            let uploadPatient = uploads[i];
            let studyFound: boolean = true;
            let seriesFound: boolean = true;

            let patient = newPatient[uploadPatient.patientID];
            if (patient == null) {
                newPatient[uploadPatient.patientID] = uploadPatient;
                continue;
            }

            let existingStudy = patient.studies.find((stud) => {
                return stud.studyID === uploadPatient.studies[0].studyID;
            });

            if (existingStudy === undefined) {
                studyFound = false;
                existingStudy = uploadPatient.studies[0];
            }

            let existingSeries = existingStudy.series.find((seria) => {
                return seria.seriesID === uploadPatient.studies[0].series[0].seriesID;
            });

            if (existingSeries === undefined) {
                seriesFound = false;
                existingSeries = uploadPatient.studies[0].series[0];
            }


            let newImage: ImageJSON = uploadPatient.studies[0].series[0].images[0];

            if (existingSeries.images.length > 0) {
                let existingImage = existingSeries.images.find((image) => {
                    return image.imageNumber === newImage.imageNumber;
                });
                if (existingImage == undefined)
                    existingSeries.images.push(newImage);

            } else {
                existingSeries.images.push(newImage);
            }

            if (!seriesFound)
                existingStudy.series.push(existingSeries)

            if (!studyFound)
                patient.studies.push(existingStudy);

            newPatient[uploadPatient.patientID] = patient;

        }

        return newPatient;
    };
}