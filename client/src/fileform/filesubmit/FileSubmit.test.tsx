
import * as React from 'react';
import { shallow } from 'enzyme';
import { FileSubmitComponent } from './FileSubmit';

describe('<FileSubmit />', () => {
    it('should render with true active prop', () => {
        const props = {
            active: true
        };
        shallow(<FileSubmitComponent {...props} />);
    });

    it('should render with false active prop', () => {
        const props = {
            active: false
        };
        shallow(<FileSubmitComponent {...props} />);
    });

    it('should render with undefined active prop', () => {
        const props = {
            active: undefined
        };
        shallow(<FileSubmitComponent {...props} />);
    });

    it('should be enabled if active prop is true', () => {
        const props = {
            active: true
        };
        const fileSubmit = shallow(<FileSubmitComponent {...props} />);
        expect(fileSubmit.find('input').prop('disabled')).toBeFalsy();
    });

    it('should be disabled if active prop is false', () => {
        const props = {
            active: false
        };
        const fileSubmit = shallow(<FileSubmitComponent {...props} />);
        expect(fileSubmit.find('input').prop('disabled')).toBeTruthy();
    });

    it('should be disabled if active prop is undefined', () => {
        const props = {
            active: undefined
        };
        const fileSubmit = shallow(<FileSubmitComponent {...props} />);
        expect(fileSubmit.find('input').prop('disabled')).toBeTruthy();
    });
});