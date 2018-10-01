import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ApplicationState } from '../../store';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import MemberUserMenu from './MemberUserMenu';
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
        const { username } = this.props;
        if (username == "")
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