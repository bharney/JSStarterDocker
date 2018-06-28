import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as SessionState from '../../store/Session';
import * as AlertState from '../../store/Alert';
import { AlertType } from '../../models';
import { bindActionCreators, Dispatch } from 'redux';

export function requireAuthentication(Component:React.ComponentClass) {
    type SessionProps = SessionState.SessionState
    & {
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators
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

            if (props.token === undefined){
                this.props.alertActions.sendAlert('You must sign-in before you can access this area.', AlertType.danger, true);
                this.props.sessionActions.cancelRequiredToken();
                this.props.sessionActions.requiredToken();
                this.props.history.replace(`/signin`);
            }
        }

        render() {
            return (
                <Component {...this.props}/>
            )
        }
    }
    return connect(
        (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
        (dispatch: Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState>) => {
            return {
                sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
                alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
            }
        }                  // Selects which action creators are merged into the component's props
    )(AuthenticatedComponent) as typeof AuthenticatedComponent;
}