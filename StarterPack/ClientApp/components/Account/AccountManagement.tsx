import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import * as AccountState from "../../store/Account";
import Loading from "../Common/Loading";

type AccountManagementProps = AccountState.AccountState &
  RouteComponentProps<{}>;
// At runtime, Redux will merge together...

class AccountManagement extends React.Component<AccountManagementProps, {}> {
  render() {
    const { isLoading } = this.props;
    const { username } = this.props;
    return isLoading ? (
      <Loading />
    ) : (
      <div className="container pt-4">
        <div className="row justify-content-center">
          <div className="col-12 form-wrapper">
            <h2 className="text-center display-4">Account.</h2>
          </div>
          <div className="col-12 col-sm-8 col-md-8 col-lg-5 form-wrapper">
            <div className="col-12 offset-sm-3 justify-content-center pl-2">
              <div className="form-group">
                <p>
                  <strong>Email:</strong> {username}
                </p>
              </div>
            </div>
            <div className="form-group">
              <div className="row justify-content-center">
                                <div className="col-12 col-sm-10 col-md-8 form-wrapper">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    onClick={() => this.props.history.push("/Account/Edit")}
                  >
                    Change email
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row justify-content-center">
                                <div className="col-12 col-sm-10 col-md-8 form-wrapper">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    onClick={() => this.props.history.push("/ChangePassword")}
                  >
                    Change password
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row justify-content-center">
                                <div className="col-12 col-sm-10 col-md-8 form-wrapper">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    onClick={() => this.props.history.push("/Account/Export")}
                  >
                    Export Account Data
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row justify-content-center">
                                <div className="col-12 col-sm-10 col-md-8 form-wrapper">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    onClick={() => this.props.history.push("/Account/Delete")}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountManagement;
