import * as React from 'react';
import * as SessionState from '../../store/Session';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../../store';
import AdminNavMenu from './AdminNavMenu';
import { NavContext } from '../../App';
interface NavProps {
    onUpdate: () => void;
}
type MemberNavMenuProps = SessionState.SessionState
    & { sessionActions: typeof SessionState.actionCreators };

export class MemberNavMenu extends React.Component<MemberNavMenuProps, {}> {
    public render() {
        const { token } = this.props;

        if (token == undefined)
            return null
        if (Object.keys(token).length === 0)
            return null

        return <NavContext.Consumer {...this.props}>
            {({ onUpdate }: NavProps) => (
                <React.Fragment>
                    <li className="nav-item">
                        <NavLink key="nav-orders" className="nav-link" to={'/orders'} onClick={onUpdate} exact activeClassName='active'>Orders</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink key="nav-account" className="nav-link" to={'/profile'} onClick={onUpdate} exact activeClassName='active'>Account</NavLink>
                    </li>
                    <AdminNavMenu {...this.props} />
                </React.Fragment>
            )}
        </NavContext.Consumer>
    }
}

export default connect(
    (state: ApplicationState) => { return state.session }, // Selects which state properties are merged into the component's props
    (dispatch: Dispatch<SessionState.SessionState>) => { // Selects which action creators are merged into the component's props
        return {
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
        };
    },
)(MemberNavMenu) as typeof MemberNavMenu;
