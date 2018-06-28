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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
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

export class MemberUserMenu extends React.Component<MemberUserMenuProps, {}> {
    componentDidUpdate(prevProps: MemberUserMenuProps) {
        if (this.props.isRequiredToken) {
            this.props.sessionActions.loadToken();
        }
    }

    componentDidMount() {
        if (this.props.isRequiredRefreshOnClient) {
            this.props.sessionActions.loadToken();
        }
    }

    onLogout = (onUpdate) => {
        this.props.accountActions.logout(() => {
            this.props.alertActions.sendAlert('Signed out successfully!', AlertType.danger, true);
            this.props.sessionActions.requiredToken();
            onUpdate();
        })
    }

    public render() {
        const { token, username } = this.props;

        const SignIn = () => {
            return <NavContext.Consumer {...this.props}>
                {({ onUpdate }: NavProps) => (<li key="signInMenu" className="nav-item">
                    <Link key="signIn" className="nav-link text-primary userMenu user-icon" to="/signin" onClick={onUpdate}>
                        <FontAwesomeIcon key="sign-in" className="sign-in" size="1x" icon={faSignInAlt} /> Sign In</Link>
                </li>)}
            </NavContext.Consumer>
        }

        if (token === undefined || Object.keys(token).length === 0) {
            return <SignIn />
        }

        return <NavContext.Consumer {...this.props}>
            {({ onUpdate }: NavProps) => (
                <li key="userMenu" className="nav-item dropdown max-userName d-flex justify-content-center align-items-center" id="dropdown01">
                    <Link key="userIcon" className="nav-link text-primary userName user-icon" to="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon key="signed-in" className="signed-in" size="1x" icon={faUserCircle} />
                        <div key="ellipsis" className="ellipsis">{' ' + (username || '')}</div>
                        <FontAwesomeIcon key="dropdown-arrow" className="svg-inline--fa fa-w-16 fa-lg dropdown-arrow" size="1x" icon={faSortDown} />
                    </Link>
                    <div className="dropdown-menu" aria-labelledby="dropdown01">
                        <Link key="profile" className="dropdown-item" to="/Profile" onClick={onUpdate}> <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faCog} /> Profile</Link>
                        <Link key="orders" className="dropdown-item" to="/Orders" onClick={onUpdate}> <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faShoppingBasket} /> Orders</Link>
                        <AdminUserMenu sessionActions={this.props.sessionActions} {...this.props} />
                        <Link key="logout" className="dropdown-item" onClick={() => this.onLogout(onUpdate)} to="/signedout"><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faSignOutAlt} /> Log out</Link>
                    </div>
                </li>
            )}
        </NavContext.Consumer>
    }
}

export default connect(
    (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
    (dispatch: Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState> | Dispatch<AccountState.AccountState>) => { // Selects which action creators are merged into the component's props
        return {
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
            accountActions: bindActionCreators(AccountState.actionCreators, dispatch),
        };
    },
)(MemberUserMenu) as typeof MemberUserMenu;