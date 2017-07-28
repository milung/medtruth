"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const daikon = require("daikon");
const fs = require('fs');
class DaikonConverter {
    constructor(filePath) {
        this.TAG_PATIENT_DATE_OF_BIRTH = [0x0010, 0x0030];
        this.TAG_PATIENT_SEX = [0x0010, 0x0040];
        this.TAG_PHYSICIANS_NAME = [0x0008, 0x0090];
        this.TAG_STUDY_DES = [0x0008, 0x1030];
        this.TAG_STUDY_INSTANCE_UID = [0x0020, 0x000D];
        this.TAG_STUDY_ID = [0x0020, 0x0010];
        this.TAG_SERIES_DATE = [0x0008, 0x0021];
        let buffer = fs.readFileSync(filePath);
        this.dataView = daikon.Series.parseImage(new DataView((buffer.buffer)));
    }
    nullCheck(data) {
        if (data === null || data === undefined)
            return null;
        return data;
    }
    getSeriesUID() {
        return this.nullCheck(this.dataView.getSeriesInstanceUID());
    }
    getImageNumber() {
        return this.nullCheck(this.dataView.getImageNumber());
    }
    getPatientName() {
        return this.nullCheck(this.dataView.getPatientName());
    }
    getSeriesDescription() {
        return this.nullCheck(this.dataView.getSeriesDescription());
    }
    getStudyDate() {
        return this.nullCheck(this.dataView.getStudyDate());
    }
    getStudyDescription() {
        return this.nullCheck(this.getVal(this.TAG_STUDY_DES));
    }
    getStudyInstanceUID() {
        return this.nullCheck(this.getVal(this.TAG_STUDY_INSTANCE_UID));
    }
    getStudyID() {
        return this.nullCheck(this.getVal(this.TAG_STUDY_ID));
    }
    getSeriesDate() {
        return this.nullCheck(this.getVal(this.TAG_SERIES_DATE));
    }
    getPatientID() {
        return this.nullCheck(this.dataView.getPatientID());
    }
    getPatientSex() {
        return this.nullCheck(this.getVal(this.TAG_PATIENT_SEX));
    }
    getPhysicianName() {
        return this.nullCheck(this.getVal(this.TAG_PHYSICIANS_NAME));
    }
    getPatientDateOfBirth() {
        return this.nullCheck(this.getVal(this.TAG_PATIENT_DATE_OF_BIRTH));
    }
    getVal(val) {
        var value = daikon.Image.getSingleValueSafely(this.dataView.getTag(val[0], val[1]), 0);
        return value;
    }
}
exports.DaikonConverter = DaikonConverter;
//# sourceMappingURL=daikon.js.map