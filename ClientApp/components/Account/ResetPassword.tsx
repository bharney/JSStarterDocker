import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertType } from '../../models';
import * as AccountState from '../../store/Account';
import * as SessionState from '../../store/Session';
import * as AlertState from '../../store/Alert';
import URLSearchParams from 'url-search-params';

type UserMenuProps = AccountState.AccountState
    & {
        accountActions: typeof AccountState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
    }
    & RouteComponentProps<{}>;

export class ResetPassword extends React.Component<UserMenuProps, any> {

    refs: {
        email: HTMLInputElement;
        password: HTMLInputElement;
        confirmPassword: HTMLInputElement;
    }

    private userName: HTMLInputElement | null;
    private password: HTMLInputElement | null;
    private confirmPassword: HTMLInputElement | null;

    componentDidMount() {
        document.getElementsByTagName("input")[0].focus();
    }

    render() {
        const searchParams = new URLSearchParams(this.props.location.search);
        return <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7">
                    <h2 className="text-center display-4">Reset Password.</h2>
                    <form onSubmit={
                        (e) => {
                            e.preventDefault();
                            if (this.userName && this.password && this.confirmPassword && (this.password.value === this.confirmPassword.value)) {
                                this.props.accountActions.resetPassword(this.userName.value, this.password.value, searchParams.get("userId"), searchParams.get("code"));
                                this.props.history.push('/');
                                this.props.alertActions.sendAlert('Password has been reset successfully!', AlertType.success, true);
                                this.props.sessionActions.requiredToken();
                            }
                        }} className="form" role="form" id="resetPassword">
                        <div className="form-group">
                            <label htmlFor="inputEmail" className="form-control-label">Email address</label>
                            <input type="text" ref={(input) => { this.userName = input; }} className="form-control" id="username" placeholder="Username" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword" className="form-control-label">Password</label>
                            <input type="password" ref={(input) => { this.password = input; }} className="form-control" id="password" placeholder="Password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword" className="form-control-label">Confirm Password</label>
                            <input type="password" ref={(input) => { this.confirmPassword = input; }} className="form-control" id="confirmPassword" placeholder="Confirm Password" required />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-lg btn-primary btn-block" type="submit" >Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.account, // Selects which state properties are merged into the component's props
    (dispatch: Dispatch<AccountState.AccountState> | Dispatch<AlertState.AlertState> | Dispatch<SessionState.SessionState>) => { // Selects which action creators are merged into the component's props
        return {
            accountActions: bindActionCreators(AccountState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
        };
    },
)(ResetPassword) as typeof ResetPassword;

