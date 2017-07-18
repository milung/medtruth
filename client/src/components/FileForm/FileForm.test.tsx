
import * as React from 'react';
import { shallow } from 'enzyme';
import FileForm from './FileForm';

describe('<FileForm />', () => {
    it('should render', () => {
        shallow(<FileForm />);
    });

    it('if valid file extension', () => {
        // Given
        const fileForm = shallow(<FileForm />);
        const input = fileForm.getNode().props.children[0];
        // When
        const validName: string = 'valid.dcm';
        const event: object = {target: {files: [{name: validName}]}};
        // Then
        expect(input.props.onChange(event)).toBeTruthy();
    });

    it('if invalid file extension', () => {
        // Given
        const fileForm = shallow(<FileForm />);
        const input = fileForm.getNode().props.children[0];
        // When
        const invalidName: string = 'invalid.jpg';
        const event: object = {target: {files: [{name: invalidName}]}};
        // Then
        expect(input.props.onChange(event)).toBeFalsy();
    });
});
