import * as React from "react";
import { Link } from "react-router-dom";

class SignedOut extends React.Component<{}, {}> {
    render() {
        return <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7">
                    <h2 className="text-center display-4">Signed Out.</h2>
                    <p>You have successfully signed out.</p>
                </div>
            </div>
            <p><Link to="/">Go back</Link></p>
        </div>;
    }
}

export default SignedOut;