import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';

class ForgotPasswordConfirmation extends React.Component<RouteComponentProps<{}>, {}> {
    render() {
        return <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7 text-center">
                    <h2 className=" display-4">Forgot Password Assistance.</h2>
                    <p className="lead">Please check your email to reset your password.</p>
                </div>
            </div>
        </div>;
    }
}

export default ForgotPasswordConfirmation;
