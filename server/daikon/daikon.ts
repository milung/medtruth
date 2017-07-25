import * as daikon from 'daikon';
const fs = require('fs');

export class DaikonConverter {
    private dataView;

    TAG_PATIENT_DATE_OF_BIRTH = [0x0010, 0x0030];

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

    getPatientDateOfBirth(): Date {
        var date = daikon.Image.getSingleValueSafely(
            this.dataView.getTag(this.TAG_PATIENT_DATE_OF_BIRTH[0], this.TAG_PATIENT_DATE_OF_BIRTH[1]),
            0) as Date;
        return date
    }

    getPatientID(): string{
        return this.dataView.getPatientID();
    }
 
}
