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

    getSeriesUID(): string {
        return this.dataView.getSeriesInstanceUID();

    }
    getImageNumber(): string {
        return this.dataView.getImageNumber();
    }
    getPatientName(): string {
        return this.dataView.getPatientName();
    }

    getSeriesDescription(): string {
        return this.dataView.getSeriesDescription();
    }

    getStudyDate(): Date {
        let y = this.dataView.getStudyDate();
        if (y === null || y === undefined) return null;
        return y;
    }

    getStudyDescription() {
        return this.getVal(this.TAG_STUDY_DES);;
    }

    getStudyInstanceUID() {
        return this.getVal(this.TAG_STUDY_INSTANCE_UID);;
    }

    getStudyID() {
        return this.getVal(this.TAG_STUDY_ID);;
    }

    getSeriesDate(): Date {
        let y = this.getVal(this.TAG_SERIES_DATE);
        if (y === null || y === undefined) return null;
        return y;
    }

    getPatientID(): string {
        return this.dataView.getPatientID();
    }

    getPatientSex(): string {
        return this.getVal(this.TAG_PATIENT_SEX);;
    }

    getPhysicianName(): string {
        return this.getVal(this.TAG_PHYSICIANS_NAME);
    }

    getPatientDateOfBirth(): Date {
        let y = this.getVal(this.TAG_PATIENT_DATE_OF_BIRTH);
        if (y === null || y === undefined) return null;
        return y;
    }



    private getVal(val) {
        var value = daikon.Image.getSingleValueSafely(
            this.dataView.getTag(val[0], val[1]),
            0);
        return value;
    }

}
