import * as React from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { RouteComponentProps, Link } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import { InjectedFormProps, reset } from "redux-form";
import { AlertType, Field as ModelField, ConfirmEmailViewModel } from "../../models";
import { ApplicationState } from "../../store/index";
import * as AccountState from "../../store/Account";
import * as AlertState from "../../store/Alert";
import * as SessionState from "../../store/Session";
import URLSearchParams from "url-search-params";
import LoadingRoute from "../Common/LoadingRoute";


type ConfirmRegistrationEmailProps = AccountState.AccountState & {
    accountActions: typeof AccountState.actionCreators;
    alertActions: typeof AlertState.actionCreators;
    sessionActions: typeof SessionState.actionCreators;
} & RouteComponentProps<{userId: string, code: string }>;

interface AdditionalProps {
    onCancel: () => void;
    fields: ModelField[];
    formButton?: string;
}

type FormProps = InjectedFormProps & AdditionalProps;

export class ConfirmRegistrationEmail extends React.Component<
    ConfirmRegistrationEmailProps,
    FormProps
    > {

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        this.props.accountActions.confirmRegistrationEmail(
                {
                    code: searchParams.get("code"),
                    userId: searchParams.get("userId")
                },
                () => {
                    this.props.alertActions.sendAlert(
                        "Your account has been registered successfully!",
                        AlertType.success,
                        true
                    );
                    this.props.sessionActions.loadToken();
                },
                error => {
                    this.props.alertActions.sendAlert(
                        error.error_description,
                        AlertType.danger,
                        true
                    );
                }
            );
    }
    render() {

        return (
            <div className="container pt-4">
                <div className="row justify-content-center pt-4">
                    <div className="col-12 col-sm-8 col-lg-7">
                        <h2 className="text-center display-4">Confirm Email.</h2>
                        <p>Thank you for confirming your email. You can now login using your Account.
                            Remember if you forget your password you can always use <Link to="/forgotpassword">Forgot Password</Link> Assistance.</p>
                        <br />
                        <br />
                        <p><Link to="/">Go back</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.account, // Selects which state properties are merged into the component's props
    (
        dispatch:
            | Dispatch<AccountState.AccountState>
            | Dispatch<AlertState.AlertState>
            | Dispatch<SessionState.SessionState>
    ) => {
        // Selects which action creators are merged into the component's props
        return {
            accountActions: bindActionCreators(AccountState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch)
        };
    }
)(ConfirmRegistrationEmail) as typeof ConfirmRegistrationEmail;
