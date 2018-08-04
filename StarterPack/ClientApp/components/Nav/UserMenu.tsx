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
import { SignIn } from './SignIn';

interface NavProps {
    onUpdate: () => void;
}

type UserMenuProps = SessionState.SessionState
    & {
        accountActions: typeof AccountState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators;
    }

export class UserMenu extends React.Component<UserMenuProps, {}> {
    componentDidUpdate(prevProps: UserMenuProps) {
        if (this.props.isRequiredToken) {
            this.props.sessionActions.loadToken();
        }
    }
    componentDidMount() {
        if (this.props.isRequiredRefreshOnClient) {
            this.props.sessionActions.loadToken();
        }
    }
  
    public render() {
        const { token, username } = this.props;

        if (token == undefined)
            return null
        if (Object.keys(token).length === 0)
            return null

    return <React.Fragment>
        <SignIn username={username} />
        <MemberUserMenu {...this.props} />
        </React.Fragment>
    }
}

export default connect(
    (state: ApplicationState) => { return state.session }, // Selects which state properties are merged into the component's props
    (dispatch: Dispatch<SessionState.SessionState>) => { // Selects which action creators are merged into the component's props
        return {
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
        };
    },
)(UserMenu) as typeof UserMenu;