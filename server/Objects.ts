

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
            "image04");

        this.setSeries(series02, "SeriesID02",
            "seriesDescription: Don't know what this thing is LOL",
            "image03");

        this.setSeries(series03, "SeriesID03",
            "seriesDescription: Scan of some part of the body.",
            "image01");

        this.setSeries(series04, "SeriesID04",
            "seriesDescription: Who are we? Why are we here? What is our purpose?",
            "image02");

        this.setSeries(series05, "SeriesID05",
            "seriesDescription: This is supposed to be a description, but im too lazy to write a proper one.",
            "image05");

        this.setSeries(series06, "SeriesID06",
            "seriesDescription This is a scan of another scan. SCANCEPTION !",
            "image06");

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
        series.images.push("image01");
        series.images.push("image02");
        series.images.push("image03");
        series.images.push("image04");
        series.images.push("image05");
        series.images.push("image06");

    }

}

export class UploadJSON {
    uploadID: number;
    uploadDate: Date;
    studies: StudyJSON[] = [];
}

export class StudyJSON {
    patientName: string;
    patientBirthday: number;
    studyDescription: string;
    studyID: string;
    series: SeriesJSON[] = [];
}

export class SeriesJSON {
    seriesID: string;
    seriesDate: number;
    seriesDescription: string;
    thumbnailImageID: string;
    images: string[] = [];
}
