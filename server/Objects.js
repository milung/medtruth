"use strict";
exports.__esModule = true;
var JSONCreator = (function () {
    function JSONCreator() {
    }
    JSONCreator.prototype.getUploadJSON = function () {
        var uploadJSON = new UploadJSON();
        uploadJSON.uploadID = 12345;
        var seriesUno = new SeriesJSON();
        var seriesDue = new SeriesJSON();
        var seriesTre = new SeriesJSON();
        var seriesQuattro = new SeriesJSON();
        var seriesDalej = new SeriesJSON();
        var seriesNeviem = new SeriesJSON();
        this.setSeries(seriesUno, "gsdf51hsf651.654gsdf54.g4ds", "Head scan or something.", "Plávka Adrián", new Date(1234567890123).getTime(), "image04");
        this.setSeries(seriesDue, "gsfd54.fg4df5hf4.5g4d", "Don't know what this thing is LOL", "Durneková Martina", new Date(1235567890123).getTime(), "image03");
        this.setSeries(seriesTre, "d54gdfs5g4d8.8f4h6df4", "Scan of some part of the body.", "Hlavatý Tomas", new Date(1243567890123).getTime(), "image01");
        this.setSeries(seriesQuattro, "w8w201w.duckfic0n.0.00145s64x", "Who are we? Why our we here? What is our purpose?", "Chudjak Kristián", new Date(1143567890123).getTime(), "image02");
        this.setSeries(seriesDalej, "fdsa541g6ds.51fsad56.45", "This is supose to be a description, but im too lazy to write a proper one.", "Nguyenová Michaela", new Date(1292567890123).getTime(), "image05");
        this.setSeries(seriesNeviem, "w15fsd51.51sdfa.54", "This is a scan of another scan. SCANCEPTION !", "Pištek Marek", new Date(1283467890123).getTime(), "image06");
        uploadJSON.series.push(seriesUno);
        uploadJSON.series.push(seriesDue);
        uploadJSON.series.push(seriesTre);
        uploadJSON.series.push(seriesQuattro);
        uploadJSON.series.push(seriesDalej);
        uploadJSON.series.push(seriesNeviem);
        return (uploadJSON);
    };
    JSONCreator.prototype.setSeries = function (series, seriesID, seriesDescription, patientName, birthday, thumbnail) {
        series.seriesID = seriesID;
        series.seriesDescription = seriesDescription;
        series.patientName = patientName;
        series.patienBirthDate = birthday;
        series.thumbnailImageID = thumbnail;
    };
    return JSONCreator;
}());
exports.JSONCreator = JSONCreator;
var UploadJSON = (function () {
    function UploadJSON() {
        this.series = new Array();
    }
    return UploadJSON;
}());
var SeriesJSON = (function () {
    function SeriesJSON() {
    }
    return SeriesJSON;
}());
