import * as daikon from 'daikon';
const fs = require('fs');

export class DaikonConverter {
    private dataView;

    TAG_PATIENT_DATE_OF_BIRTH = [0x0010, 0x0030];
    TAG_PATIENT_SEX = [0x0010, 0x0040];
    TAG_PHYSICIANS_NAME = [0x0008, 0x0090];
    TAG_STUDY_DES = [0x0008, 0x1030];
    TAG_STUDY_INSTANCE_UID = [0x0020, 0x000D];
    TAG_STUDY_ID = [0x0020, 0x0010];
    TAG_SERIES_DATE = [0x0008, 0x0021];


    constructor(filePath: string) {
        let buffer: Buffer = fs.readFileSync(filePath);
        this.dataView = daikon.Series.parseImage(new DataView((buffer.buffer)));
    }


    nullCheck(data: any) {
        if (data === null || data === undefined) return null;
        return data;
    }

    getSeriesUID(): string {
        return this.nullCheck(this.dataView.getSeriesInstanceUID());
    }
    getImageNumber(): string {
        return this.nullCheck(this.dataView.getImageNumber());
    }
    getPatientName(): string {
        return this.nullCheck(this.dataView.getPatientName());
    }

    getSeriesDescription(): string {
        return this.nullCheck(this.dataView.getSeriesDescription());
    }

    getStudyDate(): Date {
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

    getSeriesDate(): Date {
        return this.nullCheck(this.getVal(this.TAG_SERIES_DATE));
    }

    getPatientID(): string {
        return this.nullCheck(this.dataView.getPatientID());
    }

    getPatientSex(): string {
        return this.nullCheck(this.getVal(this.TAG_PATIENT_SEX));
    }

    getPhysicianName(): string {
        return this.nullCheck(this.getVal(this.TAG_PHYSICIANS_NAME));
    }

    getPatientDateOfBirth(): Date {
        return this.nullCheck(this.getVal(this.TAG_PATIENT_DATE_OF_BIRTH));
    }

    private getVal(val) {
        var value = daikon.Image.getSingleValueSafely(
            this.dataView.getTag(val[0], val[1]),
            0);
        return value;
    }

}
