
import * as daikon from 'daikon';

export namespace Daikon {
    export function information(data: any): void {
        daikon.Parser.verbose = false;
        let dataView = daikon.Series.parseImage(new DataView(data));
        console.log('Width & height:',          dataView.getCols(), dataView.getRows());
        console.log('Series desc:',             dataView.getSeriesDescription());
        console.log('Image max & min:',         dataView.getImageMax(), dataView.getImageMin());
        console.log('Window width & center:',   dataView.getWindowWidth(), dataView.getWindowCenter());
        console.log('Pixel spacing:',           dataView.getPixelSpacing());
        console.log('Image type:',              dataView.getImageType());
        console.log('Bits stored:',             dataView.getBitsStored());
        console.log('Bits allocated:',          dataView.getBitsAllocated());
        console.log('Orientation:',             dataView.getOrientation());
        console.log('Compressed:',              dataView.isCompressed());
        console.log('Number of frames:',        dataView.getNumberOfFrames());
        console.log('Pixel representation:',    dataView.getPixelRepresentation());
        console.log('Patient name:',            dataView.getPatientName());
        console.log('Patient ID:',              dataView.getPatientID());
        console.log('Study time:',              dataView.getStudyTime());
        console.log('Planar config:',           dataView.getPlanarConfig());
        console.log('Image desc:',              dataView.getImageDescription());
        console.log('Data type:',               dataView.getDataType());
    }
}