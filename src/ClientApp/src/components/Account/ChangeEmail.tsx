import * as React from "react";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import { RouteComponentProps, Link } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import { InjectedFormProps, reset } from "redux-form";
import { AlertType, ChangeEmailViewModel, Field as ModelField } from "../../models";
import { ApplicationState } from "../../store/index";
import * as AccountState from "../../store/Account";
import * as AlertState from "../../store/Alert";
import * as SessionState from "../../store/Session";
import LoadingRoute from "../Common/LoadingRoute";
const AsyncChangeEmailForm = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ChangeEmailForm" */ "../Account/ChangeEmailForm"),
    modules: ["../Account/ChangeEmailForm"],
    webpack: () => [require.resolveWeak("../Account/ChangeEmailForm")],
    loading: LoadingRoute
});

type ChangePasswordProps = AccountState.AccountState & {
    accountActions: typeof AccountState.actionCreators;
    alertActions: typeof AlertState.actionCreators;
    sessionActions: typeof SessionState.actionCreators;
} & RouteComponentProps<{}>;

interface AdditionalProps {
    onCancel: () => void;
    fields: ModelField[];
    formButton?: string;
}

type FormProps = InjectedFormProps & AdditionalProps;

export class ChangeEmail extends React.Component<
    ChangePasswordProps,
    FormProps
    > {
    render() {
        return (
            <div className="container pt-4">
                <div className="row justify-content-center pt-4">
                    <div className="col-12 col-sm-8 col-lg-7">
                        <h2 className="text-center display-4">Change Email.</h2>
                        <AsyncChangeEmailForm
                            form="changeEmailForm"
                            enableReinitialize={true}
                            onSubmit={(values: ChangeEmailViewModel, dispatch) => {
                                this.props.accountActions.changeEmail(
                                    values,
                                    () => {
                                        this.props.history.push("/Account/ChangeEmail/Confirmation");
                                        this.props.alertActions.sendAlert(
                                            "Confirmation Email as been sent successfully!",
                                            AlertType.success,
                                            true
                                        );
                                        dispatch(reset("changeEmailForm"));
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
)(ChangeEmail) as typeof ChangeEmail;
