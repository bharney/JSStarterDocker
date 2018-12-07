import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { NavContext } from '../../App';
import { AlertType } from '../../models';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import AdminUserMenu from './AdminUserMenu';


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
        const { username } = this.props;

        if (username == "")
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
                                <Link key="account" className="dropdown-item" to="/Account" onClick={onUpdate}> <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faCog} /> Account</Link>
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