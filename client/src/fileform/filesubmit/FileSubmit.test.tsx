
import * as React from 'react';
import { shallow } from 'enzyme';
import { FileSubmit } from './FileSubmit';

describe('<FileSubmit />', () => {
    it('should render with true active prop', () => {
        shallow(<FileSubmit active={true} />);
    });

    it('should render with false active prop', () => {
        shallow(<FileSubmit active={undefined} />);
        shallow(<FileSubmit active={false} />);
    });

    it('should be enabled if active prop is true', () => {
        const fileSubmit = shallow(<FileSubmit active={true} />);
        expect(fileSubmit.find('input').prop('disabled')).toBeFalsy();
    });

    it('should be disabled if active prop is false', () => {
        const fileSubmit = shallow(<FileSubmit active={false} />);
        expect(fileSubmit.find('input').prop('disabled')).toBeTruthy();
    });

    it('should be disabled if active prop is undefined', () => {
        const fileSubmit = shallow(<FileSubmit active={undefined} />);
        expect(fileSubmit.find('input').prop('disabled')).toBeTruthy();
    });
});