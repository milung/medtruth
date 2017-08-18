

/*
export class JSONCreator {
    /*getUploadJSON() {
        let uploadJSON = new UploadJSON();

        let patient=new PatientProps();
        let patient2=new PatientProps();  

        patient.patientID=1;
        patient.patientName="Robert Fico";        
        patient.dateOfBirth=new Date(1234567890123).getTime();

        patient2.patientID=2;
        patient2.patientName="Jan Matonoha";
        patient2.dateOfBirth=new Date(1234567890123).getTime();
   
        let study1 = new StudiesProps();
        let study2 = new StudiesProps();        
        
        study1.studyID = "studyID01";
        study1.studyDescription = "This is study01 description"; 

        study2.studyID = "studyID02";
        study2.studyDescription = "This study is about something very important";
   

        let series01 = new Series();
        let series02 = new Series();
        let series03 = new Series();
        let series04 = new Series();
        let series05 = new Series();
        let series06 = new Series();

        this.setSeries(series01, "SeriesID01",
            "Head scan or something.",
            "f9976359e28549595b1f8ebd63ffb01e");

        this.setSeries(series02, "SeriesID02",
            "Don't know what this thing is LOL",
            "e6ce9a48f7d1ee31fda8422912eb7a57");

        this.setSeries(series03, "SeriesID03",
            "Scan of some part of the body.",
            "f9976359e28549595b1f8ebd63ffb01e");

        this.setSeries(series04, "SeriesID04",
            "Who are we? Why are we here? What is our purpose?",
            "e6ce9a48f7d1ee31fda8422912eb7a57");

        this.setSeries(series05, "SeriesID05",
            "This is supposed to be a description, but im too lazy to write a proper one.",
            "04f518349c32cfcbe820527cee910abb");

        this.setSeries(series06, "SeriesID06",
            "This is a scan of another scan. SCANCEPTION !",
            "052bd8d959567911ba4ae06ed8267f9b");

        study1.series.push(series01);
        study1.series.push(series02);
        study1.series.push(series03);
        study1.series.push(series04);
        study2.series.push(series05);
        study2.series.push(series06);

        patient.studies.push(study1);
        patient.studies.push(study2);

        patient2.studies.push(study1);
        patient2.studies.push(study2);

        uploadJSON.listOfPatients.push(patient);
        uploadJSON.listOfPatients.push(patient2);

        return (uploadJSON);
    }

    setSeries(series: Series, seriesID: string, seriesDescription: string, thumbnail: string) {
        series.seriesID = seriesID;
        series.seriesDescription = seriesDescription;
        series.thumbnailImageID = thumbnail;

        let image=new ImageJSON();
        image.imageID="760c01cdb8abcdfcf5c77372745263cc";
        image.imageNumber=2;

         let image2=new ImageJSON();
        image2.imageID="f9976359e28549595b1f8ebd63ffb01e";
        image2.imageNumber=3;

        series.images.push(image);
        series.images.push(image2);
        // series.images.push("04914d21ab3880895f3c4e75f7ecf377", 1);
        // series.images.push("04b1f296878b9b0e2f1e2662be692ccb", 4);
        // series.images.push("04c899278a1b0cad90d8a2ff286f4e63", 3);
        // series.images.push("04f518349c32cfcbe820527cee910abb", 6);
        // series.images.push("052bd8d959567911ba4ae06ed8267f9b", 5);
    }
    */
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



