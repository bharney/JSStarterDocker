import * as React from 'react';
import { Field, reduxForm } from 'redux-form';

const changePasswordForm = ({ pristine, submitting, handleSubmit }) => 
    <form id="deleteAccountForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-label-group">
            <Field name="userName" id="userName" placeholder="Email Address" required component="input" autoFocus className="form-control" type="email" />
            <label htmlFor="userName">Email Address</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Delete Account</button>
        </div>
    </form>

export default reduxForm<any, any>({
    form: 'deleteAccountForm'
})(changePasswordForm);