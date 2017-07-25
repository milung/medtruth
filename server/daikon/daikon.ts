import * as daikon from 'daikon';
const fs = require('fs');

export class DaikonConverter {
    private dataView;

    TAG_PATIENT_DATE_OF_BIRTH = [0x0010, 0x0030];
    TAG_PATIENT_SEX = [0x0010, 0x0040];
    TAG_PHYSICIANS_NAME = [0x0008, 0x0090];


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
        var y = this.dataView.getStudyDate() as Date;
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
        return this.getVal(this.TAG_PATIENT_DATE_OF_BIRTH);
    }



    private getVal(val) {
        var value = daikon.Image.getSingleValueSafely(
            this.dataView.getTag(val[0], val[1]),
            0);
        return value;
    }

}
