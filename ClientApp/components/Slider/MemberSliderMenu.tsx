import * as React from 'react';
import * as SessionState from '../../store/Session';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { NavContext } from '../../App';
interface NavProps {
    onUpdate: () => void;
}

type MemberSliderMenuProps = SessionState.SessionState;

export class MemberSliderMenu extends React.Component<MemberSliderMenuProps, {}> {

    public render() {
        const { token } = this.props;

        if (token == undefined)
            return null
        if (Object.keys(token).length === 0)
            return null

        return <NavContext.Consumer {...this.props}>
            {({ onUpdate }: NavProps) => (
                <React.Fragment>
                    <NavLink key="sliderMyorders" className="list-group-item" to={'/orders'} onClick={onUpdate} activeClassName='active'>Orders</NavLink>
                    <NavLink key="sliderMyProfile" className="list-group-item" to={'/profile'} onClick={onUpdate} activeClassName='active'>Account</NavLink>
                </React.Fragment>
            )}
        </NavContext.Consumer>
    }
}

export default connect(
    (state: ApplicationState) => state.session, null)
    (MemberSliderMenu) as typeof MemberSliderMenu;
