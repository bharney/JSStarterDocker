import * as React from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import { InjectedFormProps, reset } from "redux-form";
import URLSearchParams from "url-search-params";
import {
    AlertType,
    Field as ModelField,
    ResetPasswordViewModel
} from "../../models";
import { ApplicationState } from "../../store/index";
import * as AccountState from "../../store/Account";
import * as AlertState from "../../store/Alert";
import * as SessionState from "../../store/Session";
import LoadingRoute from "../Common/LoadingRoute";

const AsyncResetPasswordForm = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ResetPasswordForm" */ "../Account/ResetPasswordForm"),
    modules: ["../Account/ResetPasswordForm"],
    webpack: () => [require.resolveWeak("../Account/ResetPasswordForm")],
    loading: LoadingRoute
});
type ResetPasswordProps = AccountState.AccountState & {
    accountActions: typeof AccountState.actionCreators;
    alertActions: typeof AlertState.actionCreators;
    sessionActions: typeof SessionState.actionCreators;
} & RouteComponentProps<{ userId: string; code: string }>;

interface AdditionalProps {
    onCancel: () => void;
    fields: ModelField[];
    formButton?: string;
}

type FormProps = InjectedFormProps & AdditionalProps;

export class ResetPassword extends React.Component<
    ResetPasswordProps,
    FormProps
    > {
    render() {
        const searchParams = new URLSearchParams(this.props.location.search);
        return (
            <div className="container pt-4">
                <div className="row justify-content-center pt-4">
                    <div className="col-12 col-sm-8 col-lg-7">
                        <h2 className="text-center display-4">Reset Password.</h2>
                        <AsyncResetPasswordForm
                            form="changeEmailForm"
                            enableReinitialize={true}
                            onSubmit={(values: ResetPasswordViewModel, dispatch) => {
                                this.props.accountActions.resetPassword(
                                    {
                                        userId: searchParams.get("userId"),
                                        code: searchParams.get("code"),
                                        ...values
                                    },
                                    () => {
                                        this.props.history.push("/ResetPasswordConfirmation");
                                        this.props.alertActions.sendAlert(
                                            "Password has been reset successfully!",
                                            AlertType.success,
                                            true
                                        );
                                        dispatch(reset("changeEmailForm"));
                                        this.props.sessionActions.requiredToken();
                                    },
                                    error => {
                                        this.props.alertActions.sendAlert(
                                            error.error_description,
                                            AlertType.danger,
                                            true
                                        );
                                    }
                                );
                            }}
                        />
                        <p>
                            <Link to="/account">Go back</Link>
                        </p>
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
)(ResetPassword) as typeof ResetPassword;
