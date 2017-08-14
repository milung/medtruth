
export const validFileExtensions: [string] = ['.dcm', '.ima'];
export const azureBlobStorage: string = 'https://medtruth.blob.core.windows.net/';
export const imagesBlobStorage: string = azureBlobStorage + '/images/';
export const getFullImageURL = (imageID: string) => {
    return imagesBlobStorage + imageID + '.png';
};
export const getThumbnailImageURL = (imageID: string) => {
    return imagesBlobStorage + imageID + '_.png';
};