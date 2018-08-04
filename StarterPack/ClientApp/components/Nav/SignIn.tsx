import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertType } from '../../models';
import * as AccountState from '../../store/Account';
import * as SessionState from '../../store/Session';
import * as AlertState from '../../store/Alert';
import * as ReactDOM from 'react-dom';
import MemberUserMenu from './MemberUserMenu';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
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

type UserMenuProps = any
export class SignIn extends React.Component<UserMenuProps, {}> {

    public render() {
        const { username } = this.props;

        if (username == undefined)
            return null

        if (username.indexOf("@guest.starterpack.com") > -1) {
            return <li className="nav-item">
                <NavContext.Consumer>
                    {({ onUpdate }: NavProps) => (
                        <Link className="nav-link userMenu user-icon" to="/signin" onClick={onUpdate}>
                            <FontAwesomeIcon size="1x" icon={faSignInAlt} /> Sign In</Link>)}
                </NavContext.Consumer>
            </li>
        } else {
            return null
        }
    }
}
export default SignIn;