import * as React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

const signInForm = ({ pristine, submitting, handleSubmit }) => {
    return (<form id="signinForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-label-group">
            <Field name="email" id="loginEmail" placeholder="Email" required component="input" className="form-control" type="email" />
            <label htmlFor="loginEmail">Email</label>
        </div>
        <div className="form-label-group">
            <Field name="password" id="loginPassword" placeholder="Password" required component="input" className="form-control" type="password" />
            <label htmlFor="loginPassword">Password</label>
            <Link to="/forgotPassword" className="pull-right">Forgot Password</Link>
        </div>
        <div className="form-check">
            <label htmlFor="rememberMe" className="form-check-label">
                <Field name="rememberMe" id="rememberMe" className="form-check-input" component="input" type="checkbox" /> Remember Me?
            </label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Sign-In</button>
        </div>
    </form>);
}
export default reduxForm<any, any>({
    form: 'signinForm',
    destroyOnUnmount : true
})(signInForm);