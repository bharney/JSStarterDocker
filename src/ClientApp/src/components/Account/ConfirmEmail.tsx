import * as React from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { RouteComponentProps, Link } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import { InjectedFormProps, reset } from "redux-form";
import { AlertType, ConfirmEmailViewModel, Field as ModelField } from "../../models";
import { ApplicationState } from "../../store/index";
import * as AccountState from "../../store/Account";
import * as AlertState from "../../store/Alert";
import * as SessionState from "../../store/Session";
import URLSearchParams from "url-search-params";
import LoadingRoute from "../Common/LoadingRoute";
const AsyncConfirmEmailForm = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ConfirmEmailForm" */ "../Account/ConfirmEmailForm"),
    modules: ["../Account/ConfirmEmailForm"],
    webpack: () => [require.resolveWeak("../Account/ConfirmEmailForm")],
    loading: LoadingRoute
});

type ConfirmEmailProps = AccountState.AccountState & {
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

export class ConfirmEmail extends React.Component<
    ConfirmEmailProps,
    FormProps
    > {
    render() {
        const searchParams = new URLSearchParams(this.props.location.search);

        return (
            <div className="container pt-4">
                <div className="row justify-content-center pt-4">
                    <div className="col-12 col-sm-8 col-lg-7">
                        <h2 className="text-center display-4">Confirm Email.</h2>
                        <AsyncConfirmEmailForm
                            form="confirmEmailForm"
                            enableReinitialize={true}
                            onSubmit={(values: ConfirmEmailViewModel, dispatch) => {
                                this.props.accountActions.confirmEmail(
                                    {
                                        code: searchParams.get("code"),
                                        userId: searchParams.get("userId"),
                                        ...values
                                    },
                                    () => {
                                        this.props.history.push("/Account");
                                        this.props.alertActions.sendAlert(
                                            "Email as been changed successfully!",
                                            AlertType.success,
                                            true
                                        );
                                        dispatch(reset("confirmEmailForm"));
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
                            }}
                        />
                        <p><Link to="/account">Go back</Link></p>
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
)(ConfirmEmail) as typeof ConfirmEmail;
