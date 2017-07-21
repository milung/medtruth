
import * as React from 'react';
import { shallow } from 'enzyme';
import { FileFormComponent } from './FileForm';
import { isFileValid } from './FileUtils';
import { validFileExtensions } from '../constants';

describe('<FileForm />', () => {
    it('should render', () => {
        const props = {
            change: jest.fn()
        }
        shallow(<FileFormComponent {...props}/>);
    });

    it('should return true if valid file extension', () => {
        // Given
        const validName: string = 'valid.dcm';
        // Then
        expect(isFileValid(validName, validFileExtensions)).toBeTruthy();
    });

    it('should return false if invalid file extension', () => {
        // Given
        const invalidName: string = 'invalid.png';
        // Then
        expect(isFileValid(invalidName, validFileExtensions)).toBeFalsy();
    });
});
