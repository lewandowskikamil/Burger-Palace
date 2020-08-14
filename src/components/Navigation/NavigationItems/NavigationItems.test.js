import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';


configure({ adapter: new Adapter() });

describe('<NavigationItems/>', () => {
    describe('if authenticated', ()=>{
        let wrapper;
        beforeEach(() => {
            wrapper = shallow(<NavigationItems isAuthed />);
        })
        it('should render three <NavigationItem /> components', () => {
            wrapper.setProps({isAuthed:true});
            expect(wrapper.find(NavigationItem)).toHaveLength(3);
        });
        it('should render an exact logout button', () => {
            wrapper.setProps({isAuthed:true});
            expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toBe(true);
        });
    })
    describe('if not authenticated', ()=>{
        let wrapper;
        beforeEach(() => {
            wrapper = shallow(<NavigationItems />);
        })
        it('should render two <NavigationItem>< components', () => {
            expect(wrapper.find(NavigationItem)).toHaveLength(2);
        });
    })
});