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
        const { token, username } = this.props;

        if (username == "")
            return null
        if (token == undefined)
            return null
        if (Object.keys(token).length === 0)
            return null

        if (username == undefined)
            return null

        if (username.indexOf("@guest.starterpack.com") === -1) {
            return <NavContext.Consumer {...this.props}>
            {({ onUpdate }: NavProps) => (
                <React.Fragment>
                    <NavLink key="sliderMyProfile" className="list-group-item" to={'/profile'} onClick={onUpdate} activeClassName='active'>Account</NavLink>
                </React.Fragment>
            )}
        </NavContext.Consumer>
        }

        return null;
    }
}

export default connect(
    (state: ApplicationState) => state.session, null)
    (MemberSliderMenu) as typeof MemberSliderMenu;
