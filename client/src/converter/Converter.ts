
import * as daikon from 'daikon';

export function information(data: any) {
    daikon.Parser.verbose = false;
    let dataView = daikon.Series.parseImage(new DataView(data));
    console.log("Width & height: ", dataView.getCols(), dataView.getRows());
    console.log("Series desc: ", dataView.getSeriesDescription());
    console.log("Image max & min: ", dataView.getImageMax(), dataView.getImageMin());
    console.log("Window width & center: ", dataView.getWindowWidth(), dataView.getWindowCenter());
    console.log("Pixel spacing: ", dataView.getPixelSpacing());
    console.log("Image type: ", dataView.getImageType());
    console.log("Bits stored: ", dataView.getBitsStored());
    console.log("Bits allocated: ", dataView.getBitsAllocated());
    console.log("Orientation: ", dataView.getOrientation());
    console.log("Compressed: ", dataView.isCompressed());
    console.log("Number of frames: ", dataView.getNumberOfFrames());
    console.log("Pixel representation: ", dataView.getPixelRepresentation());
    console.log("Photometric interpretation: ", dataView.getPhotometricInterpretation());
    console.log("Patient name: ", dataView.getPatientName());
    console.log("Patient ID: ", dataView.getPatientID());
    console.log("Study time: ", dataView.getStudyTime());
    console.log("Planar config: ", dataView.getPlanarConfig());
    console.log("Image desc: ", dataView.getImageDescription());
    console.log("Data type: ", dataView.getDataType());
}

export function convert(data: any): ImageData {
    daikon.Parser.verbose = false;
    let dataView = daikon.Series.parseImage(new DataView(data))
    let interpretedData = dataView.getInterpretedData(false, true);
    let array = new Uint16Array(interpretedData.data.buffer);
    for (var i = 0; i < array.length; i += 4) {
        var mono = (0.2125 * array[i]) + (0.7154 * array[i + 1]) + (0.0721 * array[i + 2]);
        array[i] = array[i + 1] = array[i + 2] = mono;
    }
    let a = new Uint8ClampedArray(array.buffer);
    return new ImageData(a, interpretedData.numCols, interpretedData.numRows);
}

export class Converter {
    constructor(data: any) {
        daikon.Parser.verbose = false;
        var image = daikon.Series.parseImage(new DataView(data));
        console.log(image.getPixelData());
    }
}