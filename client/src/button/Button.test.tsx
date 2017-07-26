import * as React from 'react';
import { shallow } from 'enzyme';
import { ButtonComponent } from './button';

describe('<ButtonComponent />', () => {
    it('should render button component with right props values', () => {
        // given
        let mockFunction = jest.fn();
        const props = {
            onClick: mockFunction,
            active: true,
            text: 'Button'
        };

        // when 
        var wrapper = shallow(<ButtonComponent {...props} />);
        
        // then
        expect(
            wrapper.contains(<button onClick={mockFunction} disabled={false}>Button</button>)
        )
        .toBeTruthy();
    });

    it('should call onClick handler function when button is clicked', () => {
        // given
        let mockFunction = jest.fn();
        const props = {
            onClick: mockFunction,
            active: true,
            text: 'Button'
        };

        // when 
        shallow(<ButtonComponent {...props} />).find('button').simulate('click');
        
        // then
        expect(mockFunction.mock.calls).toHaveLength(1);
    });
});