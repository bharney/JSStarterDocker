import * as React from "react";
import { connect } from 'react-redux';
import { RouteComponentProps, Link } from 'react-router-dom';
import { ApplicationState } from '../../store/index';
import * as AccountState from '../../store/Account';

type UserMenuProps = AccountState.AccountState
    & typeof AccountState.actionCreators
    & RouteComponentProps<any>
// At runtime, Redux will merge together...

export class ForgotPassword extends React.Component<UserMenuProps, any> {
    refs: {
        username: HTMLInputElement;
    }

    private userName: HTMLInputElement | null;

    componentDidMount() {
        document.getElementsByTagName("input")[0].focus();
    }

    render() {
        return <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7">
                    <h2 className="text-center display-4">Forgot Password.</h2>
                    <p className="lead text-center">Please enter your Email address to send an Password Assistance Email to reset your password and login.</p>
                    <form onSubmit={
                        (e) => {
                            e.preventDefault();
                            if (this.userName) {
                                this.props.forgotPassword(this.userName.value);
                                this.props.history.push('/ForgotPasswordConfirmation');
                            }
                        }} className="form" role="form" id="forgotPassword">
                        <div className="form-group">
                            <label htmlFor="inputEmail" className="form-control-label">Email address</label>
                            <input type="text" ref={(input) => { this.userName = input; }} className="form-control" id="username" placeholder="Email" required />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-lg btn-primary btn-block" type="submit" >Send Password Assistance Email</button>
                        </div>
                    </form>
                    <p><Link to="/login">Go back</Link></p>
                </div>
            </div>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.account, // Selects which state properties are merged into the component's props
    AccountState.actionCreators                 // Selects which action creators are merged into the component's props
)(ForgotPassword) as typeof ForgotPassword;