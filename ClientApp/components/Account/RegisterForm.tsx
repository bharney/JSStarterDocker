import * as React from 'react';
import { Field, reduxForm } from 'redux-form';

const registerForm = ({ pristine, submitting, handleSubmit }) => 
    <form id="registerForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-label-group">
            <Field name="email" id="registerEmail" placeholder="Email" required component="input" autoFocus className="form-control" type="email" />
            <label htmlFor="registerEmail">Email</label>
        </div>
        <div className="form-label-group">
            <Field name="password" id="registerPassword" placeholder="Password" required component="input" className="form-control" type="password" />
            <label htmlFor="registerPassword">Password</label>
        </div>
        <div className="form-label-group">
            <Field name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required component="input" className="form-control" type="password" />
            <label htmlFor="confirmPassword">Confirm Password</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Register</button>
        </div>
    </form>

export default reduxForm<any, any>({
    form: 'registerForm'
})(registerForm);