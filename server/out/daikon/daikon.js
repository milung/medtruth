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
        let buffer = fs.readFileSync(filePath);
        this.dataView = daikon.Series.parseImage(new DataView((buffer.buffer)));
    }
    getSeriesUID() {
        return this.dataView.getSeriesInstanceUID();
    }
    getImageNumber() {
        return this.dataView.getImageNumber();
    }
    getPatientName() {
        return this.dataView.getPatientName();
    }
    getSeriesDescription() {
        return this.dataView.getSeriesDescription();
    }
    getStudyDate() {
        var y = this.dataView.getStudyDate();
        return y;
    }
    getStudyDescription() {
        return this.getVal(this.TAG_STUDY_DES);
        ;
    }
    getStudyInstanceUID() {
        return this.getVal(this.TAG_STUDY_INSTANCE_UID);
        ;
    }
    getStudyID() {
        return this.getVal(this.TAG_STUDY_ID);
        ;
    }
    getPatientID() {
        return this.dataView.getPatientID();
    }
    getPatientSex() {
        return this.getVal(this.TAG_PATIENT_SEX);
        ;
    }
    getPhysicianName() {
        return this.getVal(this.TAG_PHYSICIANS_NAME);
    }
    getPatientDateOfBirth() {
        return this.getVal(this.TAG_PATIENT_DATE_OF_BIRTH);
    }
    getVal(val) {
        var value = daikon.Image.getSingleValueSafely(this.dataView.getTag(val[0], val[1]), 0);
        return value;
    }
}
exports.DaikonConverter = DaikonConverter;
//# sourceMappingURL=daikon.js.map