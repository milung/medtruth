"use strict";
exports.__esModule = true;
var JSONCreator = (function () {
    function JSONCreator() {
    }
    JSONCreator.prototype.getUploadJSON = function () {
        var uploadJSON = new UploadJSON();
        uploadJSON.uploadID = 12345;
        uploadJSON.uploadDate = new Date();
        var study1 = new StudyJSON();
        var study2 = new StudyJSON();
        study1.studyID = "studyID 01";
        study1.studyDescription = "This is study01 description";
        study1.patientName = "Hlavatý Tomas";
        study1.patientBirthday = new Date(1234567890123).getTime();
        study2.studyID = "studyID is 02";
        study2.studyDescription = "This study is about something very important";
        study2.patientName = "Chudjak Kristián";
        study2.patientBirthday = new Date(1243567890123).getTime();
        var series01 = new SeriesJSON();
        var series02 = new SeriesJSON();
        var series03 = new SeriesJSON();
        var series04 = new SeriesJSON();
        var series05 = new SeriesJSON();
        var series06 = new SeriesJSON();
        this.setSeries(series01, "SeriesID01", "seriesDescription: Head scan or something.", "image04");
        this.setSeries(series02, "SeriesID02", "seriesDescription: Don't know what this thing is LOL", "image03");
        this.setSeries(series03, "SeriesID03", "seriesDescription: Scan of some part of the body.", "image01");
        this.setSeries(series04, "SeriesID04", "seriesDescription: Who are we? Why are we here? What is our purpose?", "image02");
        this.setSeries(series05, "SeriesID05", "seriesDescription: This is supposed to be a description, but im too lazy to write a proper one.", "image05");
        this.setSeries(series06, "SeriesID06", "seriesDescription This is a scan of another scan. SCANCEPTION !", "image06");
        study1.series.push(series01);
        study1.series.push(series02);
        study1.series.push(series03);
        study1.series.push(series04);
        study2.series.push(series05);
        study2.series.push(series06);
        uploadJSON.studies.push(study1);
        uploadJSON.studies.push(study2);
        return (uploadJSON);
    };
    JSONCreator.prototype.setSeries = function (series, seriesID, seriesDescription, thumbnail) {
        series.seriesID = seriesID;
        series.seriesDescription = seriesDescription;
        series.thumbnailImageID = thumbnail;
        series.images.push("04556da2ce2edd91fe3ca5c1f335524b");
        series.images.push("04914d21ab3880895f3c4e75f7ecf377");
        series.images.push("04b1f296878b9b0e2f1e2662be692ccb");
        series.images.push("04c899278a1b0cad90d8a2ff286f4e63");
        series.images.push("04f518349c32cfcbe820527cee910abb");
        series.images.push("052bd8d959567911ba4ae06ed8267f9b");
    };
    return JSONCreator;
}());
exports.JSONCreator = JSONCreator;
var UploadJSON = (function () {
    function UploadJSON() {
        this.studies = [];
    }
    return UploadJSON;
}());
exports.UploadJSON = UploadJSON;
var StudyJSON = (function () {
    function StudyJSON() {
        this.series = [];
    }
    return StudyJSON;
}());
exports.StudyJSON = StudyJSON;
var SeriesJSON = (function () {
    function SeriesJSON() {
        this.images = [];
    }
    return SeriesJSON;
}());
exports.SeriesJSON = SeriesJSON;
