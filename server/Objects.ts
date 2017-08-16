

/*
export class JSONCreator {
    getUploadJSON() {
        let uploadJSON = new UploadJSON();
        uploadJSON.uploadID = 12345;
        uploadJSON.uploadDate = new Date();
        let study1 = new StudyJSON();
        let study2 = new StudyJSON();

        study1.studyID = "studyID 01";
        study1.studyDescription = "This is study01 description";
        study1.patientName = "Hlavatý Tomas";
        study1.patientBirthday = new Date(1234567890123).getTime();

        study2.studyID = "studyID is 02";
        study2.studyDescription = "This study is about something very important";
        study2.patientName = "Chudjak Kristián";
        study2.patientBirthday = new Date(1243567890123).getTime();

        let series01 = new SeriesJSON();
        let series02 = new SeriesJSON();
        let series03 = new SeriesJSON();
        let series04 = new SeriesJSON();
        let series05 = new SeriesJSON();
        let series06 = new SeriesJSON();

        this.setSeries(series01, "SeriesID01",
            "seriesDescription: Head scan or something.",
            "04b1f296878b9b0e2f1e2662be692ccb");

        this.setSeries(series02, "SeriesID02",
            "seriesDescription: Don't know what this thing is LOL",
            "04914d21ab3880895f3c4e75f7ecf377");

        this.setSeries(series03, "SeriesID03",
            "seriesDescription: Scan of some part of the body.",
            "04b1f296878b9b0e2f1e2662be692ccb");

        this.setSeries(series04, "SeriesID04",
            "seriesDescription: Who are we? Why are we here? What is our purpose?",
            "04c899278a1b0cad90d8a2ff286f4e63");

        this.setSeries(series05, "SeriesID05",
            "seriesDescription: This is supposed to be a description, but im too lazy to write a proper one.",
            "04f518349c32cfcbe820527cee910abb");

        this.setSeries(series06, "SeriesID06",
            "seriesDescription This is a scan of another scan. SCANCEPTION !",
            "052bd8d959567911ba4ae06ed8267f9b");

        study1.series.push(series01);
        study1.series.push(series02);
        study1.series.push(series03);
        study1.series.push(series04);
        study2.series.push(series05);
        study2.series.push(series06);

        uploadJSON.studies.push(study1);
        uploadJSON.studies.push(study2);

        return (uploadJSON);
    }

    setSeries(series: SeriesJSON, seriesID: string, seriesDescription: string, thumbnail: string) {
        series.seriesID = seriesID;
        series.seriesDescription = seriesDescription;
        series.thumbnailImageID = thumbnail;
        // series.images.push("04556da2ce2edd91fe3ca5c1f335524b", 2);
        // series.images.push("04914d21ab3880895f3c4e75f7ecf377", 1);
        // series.images.push("04b1f296878b9b0e2f1e2662be692ccb", 4);
        // series.images.push("04c899278a1b0cad90d8a2ff286f4e63", 3);
        // series.images.push("04f518349c32cfcbe820527cee910abb", 6);
        // series.images.push("052bd8d959567911ba4ae06ed8267f9b", 5);
    }
}
*/
export class UploadJSON {
    patientID: string;
    patientName: string;
    patientBirtday: number;
    studies: StudyJSON[] = [];
}

export class StudyJSON {
    studyDescription: string;
    studyID: string;
    series: SeriesJSON[] = [];
}

export class SeriesJSON {
    seriesID: string;
    seriesDate: number;
    seriesDescription: string;
    thumbnailImageID: string;
    images: ImageJSON[] = [];
}

export class ImageJSON {
    imageID: string;
    imageNumber: number;
}
