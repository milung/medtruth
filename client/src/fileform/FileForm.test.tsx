
import * as React from 'react';
import { shallow } from 'enzyme';
import { FileForm } from './FileForm';

describe('<FileForm />', () => {
    it('should render', () => {
        const props = {
            change: jest.fn()
        }
        shallow(<FileForm {...props}/>);
    });

    it('if valid file extension', () => {
        // Given
        const props = {
            change: jest.fn()
        }
        const fileForm = shallow(<FileForm {...props}/>);
        const input = fileForm.getNode().props.children[0];
        // When
        const validName: string = 'valid.dcm';
        const event: object = {target: {files: [{name: validName}]}};
        // Then
        expect(input.props.onChange(event)).toBeTruthy();
    });

    it('if invalid file extension', () => {
        // Given
        const props = {
            change: jest.fn()
        }
        const fileForm = shallow(<FileForm {...props}/>);
        const input = fileForm.getNode().props.children[0];
        // When
        const invalidName: string = 'invalid.jpg';
        const event: object = {target: {files: [{name: invalidName}]}};
        // Then
        expect(input.props.onChange(event)).toBeFalsy();
    });

    it('if none file selected', () => {
        // Given
        const props = {
            change: jest.fn()
        }
        const fileForm = shallow(<FileForm {...props} />);
        const input = fileForm.getNode().props.children[0];
        // When
        const event: object = {target: {files: [undefined]}};
        // Then
        expect(input.props.onChange(event)).toBeFalsy();
    });
});
