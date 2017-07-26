import * as React from 'react';
import { shallow } from 'enzyme';
import { OneLineInformationComponent } from './OneLineInformation';

describe('<OneLineInformationComponent />', () => {
    it('should render p component with right text', () => {
        // given
        const props = {
            text: 'one line information'
        };

        // when 
        var wrapper = shallow(<OneLineInformationComponent {...props} />);

        // then
        expect(
            wrapper.contains(<p >one line information</p>)
        )
            .toBeTruthy();
    });
});