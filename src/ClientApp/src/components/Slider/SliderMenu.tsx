import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { NavContext } from '../../App';
interface NavProps {
    onUpdate: () => void;
}

export class SliderMenu extends React.PureComponent<{}, {}>{

    public render() {
        return <NavContext.Consumer>
            {({ onUpdate }: NavProps) => (
                <React.Fragment>
                        <NavLink className="list-group-item" to={'/counter'} onClick={onUpdate} activeClassName='active'>
                                Counter
                        </NavLink>
                        <NavLink className="list-group-item" to={'/fetchdata'} onClick={onUpdate} activeClassName='active'>
                                Fetch Data
                        </NavLink>
                </React.Fragment>
            )}
        </NavContext.Consumer>
    }
}

export default SliderMenu;