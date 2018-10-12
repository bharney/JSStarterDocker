import * as React from "react";
import { RouteComponentProps, Link } from 'react-router-dom';

class ForgotPasswordConfirmation extends React.Component<RouteComponentProps<{}>, {}> {
    render() {
        return <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7 text-center">
                    <h2 className=" display-4">Email Confirmation Required.</h2>
                    <p className="lead">Please check your email to confirm that you own the email
                        address associated with your account. We only use your account information
                        to allow password resets. We will never send you junk mail, or provide your
                        information to 3rd parties. We value privacy and security.</p>
                </div>
                <p><Link to="/register">Go back</Link></p>
            </div>
        </div>;
    }
}

export default ForgotPasswordConfirmation;
