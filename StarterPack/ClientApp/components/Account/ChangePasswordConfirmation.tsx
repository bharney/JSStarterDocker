import * as React from "react";
import { Link } from "react-router-dom";

class ChangePasswordConfirmation extends React.Component<{}, {}> {
  render() {
    return (
      <div className="container pt-4">
        <div className="row justify-content-center pt-4">
          <div className="col-12 col-sm-8 col-lg-7">
            <h2 className="text-center display-4">
              Reset Password Assistance.
            </h2>
            <p>
              Your password has been reset. Please{" "}
              <Link to="/signin">click here to log in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePasswordConfirmation;
