import * as React from "react";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import URLSearchParams from 'url-search-params';
import { AlertType } from '../../models';
import { ApplicationState } from '../../store';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';

type UserMenuProps = AccountState.AccountState
    & {
        accountActions: typeof AccountState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
    }
    & RouteComponentProps<{}>;

export class ResetPassword extends React.Component<UserMenuProps, any> {

    refs: {
        oldPassword: HTMLInputElement;
        newPassword: HTMLInputElement;
        confirmPassword: HTMLInputElement;
    }

    private oldPassword: HTMLInputElement | null;
    private newPassword: HTMLInputElement | null;
    private confirmPassword: HTMLInputElement | null;

    componentDidMount() {
        document.getElementsByTagName("input")[0].focus();
    }

    render() {
        return <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7">
                    <h2 className="text-center display-4">Change Password.</h2>
                    <form onSubmit={
                        (e) => {
                            e.preventDefault();
                            if (this.oldPassword && this.newPassword && this.confirmPassword) {
                                this.props.accountActions.changePassword(this.oldPassword.value, this.newPassword.value, this.confirmPassword.value);
                                this.props.history.push('/Account');
                                this.props.alertActions.sendAlert('Password has been changed successfully!', AlertType.success, true);
                                this.props.sessionActions.requiredToken();
                            }
                        }} className="form" role="form" id="resetPassword">
                        <div className="form-group">
                            <label htmlFor="inputEmail" className="form-control-label">Old password</label>
                            <input type="password" ref={(input) => { this.oldPassword = input; }} className="form-control" id="oldPassword" placeholder="Old password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword" className="form-control-label">New password</label>
                            <input type="password" ref={(input) => { this.newPassword = input; }} className="form-control" id="password" placeholder="New password" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword" className="form-control-label">Confirm password</label>
                            <input type="password" ref={(input) => { this.confirmPassword = input; }} className="form-control" id="confirmPassword" placeholder="Confirm password" required />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-lg btn-primary btn-block" type="submit">Change Password</button>
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

