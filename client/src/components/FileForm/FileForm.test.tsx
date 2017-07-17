
import * as React from 'react';
import { shallow } from 'enzyme';
import FileForm from './FileForm';

describe('<FileForm />', () => {
    it('should render', () => {
        shallow(<FileForm />);
    });
});
