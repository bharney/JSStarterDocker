import * as React from "react";
import { Link } from "react-router-dom";

class ChangePasswordConfirmation extends React.Component<{}, {}> {
  render() {
    return (
      <div className="container pt-4">
        <div className="row justify-content-center pt-4">
          <div className="col-12 col-sm-8 col-lg-7">
            <h2 className="text-center display-4">
              Change Emaill Assistance.
            </h2>
            <p>
                    Your email has not beern changed yet. To complete your email change,
                        you must confirm that you own your new email. We have sent a confirmation email
                    to your new email address. Please click on the link in that confirmation email to complete the change.
            </p>
              <p><Link to="/account">Go back</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePasswordConfirmation;
