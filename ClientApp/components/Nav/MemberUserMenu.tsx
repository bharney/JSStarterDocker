import * as React from 'react';
import * as SessionState from '../../store/Session';
import * as AlertState from '../../store/Alert';
import * as AccountState from '../../store/Account';
import { AlertType } from '../../models';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../../store';
import AdminUserMenu from './AdminUserMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons/faShoppingBasket';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';

import { NavContext } from '../../App';

interface NavProps {
    onUpdate: () => void;
}
type MemberUserMenuProps = SessionState.SessionState
    & {
        sessionActions: typeof SessionState.actionCreators;
        alertActions: typeof AlertState.actionCreators
        accountActions: typeof AccountState.actionCreators
    };

type AdminUserMenuProps = SessionState.SessionState
    & {
        sessionActions: typeof SessionState.actionCreators;
    };
export class MemberUserMenu extends React.Component<MemberUserMenuProps, {}> {

    onLogout = (onUpdate) => {
        this.props.accountActions.logout(() => {
            this.props.alertActions.sendAlert('Signed out successfully!', AlertType.danger, true);
            this.props.sessionActions.getToken();
            onUpdate();
        })
    }

    public render() {
        const { username, token: { claims } } = this.props;

        if (username == undefined)
            return null

        if (username.indexOf("@guest.starterpack.com") === -1) {
                return <li className="nav-item dropdown max-userName" id="dropdown01">
                    <Link className="nav-link userName user-icon d-flex justify-content-center align-items-center" to="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon className="signed-in" size="1x" icon={faUserCircle} />
                        <div key="ellipsis" className="ellipsis">{' ' + (username || '')}</div>
                        <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg dropdown-arrow" size="1x" icon={faSortDown} />
                    </Link>
                    <NavContext.Consumer>
                        {({ onUpdate }: NavProps) => (
                            <div className="dropdown-menu" aria-labelledby="dropdown01">
                                <Link key="profile" className="dropdown-item" to="/Profile" onClick={onUpdate}> <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faCog} /> Profile</Link>
                                <AdminUserMenu {...this.props as AdminUserMenuProps} />
                                <Link key="logout" className="dropdown-item" onClick={() => this.onLogout(onUpdate)} to="/signedout"><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faSignOutAlt} /> Log out</Link>
                            </div>)}
                    </NavContext.Consumer>
                </li>
            }

        return null;
    }
}

export default MemberUserMenu;