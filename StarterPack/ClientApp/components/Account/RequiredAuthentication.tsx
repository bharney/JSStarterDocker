import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertType } from '../../models';
import { ApplicationState } from '../../store';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import * as AccountState from '../../store/Account';

export function requireAuthentication(Component:React.ComponentClass) {
    type SessionProps = SessionState.SessionState
    & {
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
        accountActions: typeof AccountState.actionCreators,

    }
    & RouteComponentProps<{}>

    class AuthenticatedComponent extends React.Component<SessionProps> {

        componentDidMount() {
            this.checkAuth(this.props);
        }

        componentDidUpdate(prevProps: SessionProps) {
            if (this.props.token != prevProps) {
                this.checkAuth(prevProps);
            }
        }

        checkAuth(props: SessionProps) {
            if (props.isRequiredRefreshOnClient === true) return;

            const { username } = this.props;
            if (username.indexOf("@guest.starterpack.com") > -1) {
                this.props.alertActions.sendAlert('You must sign-in before you can access this area.', AlertType.danger, true);
                this.props.sessionActions.requiredToken();
                this.props.history.replace(`/signin`);
                this.props.sessionActions.loadToken();
            }
        }

        render() {
            const { token } = this.props;

            if (token == undefined)
                return null
            if (Object.keys(token).length === 0)
                return null

            return <Component {...this.props}/>
        }
    }
    return connect(
        (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
        (dispatch: Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState> | Dispatch<AccountState.AccountState>) => {
            return {
                sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
                alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
                accountActions: bindActionCreators(AccountState.actionCreators, dispatch)
            }
        }                  // Selects which action creators are merged into the component's props
    )(AuthenticatedComponent) as typeof AuthenticatedComponent;
}