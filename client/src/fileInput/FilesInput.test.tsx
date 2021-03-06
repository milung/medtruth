
// import * as React from 'react';
// import { shallow } from 'enzyme';
// import { FilesInputComponent } from './FilesInput';

// describe('<FilesInputComponent />', () => {
//     it('should render', () => {
//         // given
//         let mockFunction = jest.fn();
//         const props = {
//             onFilesInput: mockFunction,
//             disabled: false
//         };

//         // when then
//         shallow(<FilesInputComponent {...props} />);
//     });

//     it('should contain input element child', () => {
//         // given
//         let mockFunction = jest.fn();
//         const props = {
//             onFilesInput: mockFunction,
//             disabled: false
//         };

//         // when 
//         let wrapper = shallow(<FilesInputComponent {...props} />);

//         // then
//         expect(wrapper.find('input').exists()).toBeTruthy();
//     });

//     it('should call onFilesInput handler function on file input change event', () => {
//         // given 
//         let mockFunction = jest.fn();
//         const props = {
//             onFilesInput: mockFunction,
//             disabled: false
//         };
//         const wrapper = shallow(<FilesInputComponent {...props} />);

//         let fileMocks = [];
//         for (let ind = 0; ind < 3; ind++) {
//             fileMocks.push({
//                 name: ind
//             });
//         }

//         const args = {
//             target: {
//                 files: fileMocks
//             }
//         };

//         // when
//         wrapper.find('input').simulate('change', args);

//         // then
//         expect(mockFunction.mock.calls[0][0]).toHaveLength(fileMocks.length);
//         mockFunction.mock.calls[0][0].forEach((argument, index) => {
//             expect(argument).toMatchObject(fileMocks[index]);    
//         });

//     });
// });
