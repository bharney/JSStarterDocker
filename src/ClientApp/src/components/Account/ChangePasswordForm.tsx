import * as React from 'react';
import { Field, reduxForm } from 'redux-form';

const changePasswordForm = ({ pristine, submitting, handleSubmit }) => 
    <form id="changePasswordForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-label-group">
            <Field name="oldPassword" id="oldPasswordChange" placeholder="Old password" required component="input" autoFocus className="form-control" type="password" />
            <label htmlFor="oldPasswordChange">Old password</label>
        </div>
        <div className="form-label-group">
            <Field name="newPassword" id="newPasswordChange" placeholder="New password" required component="input" className="form-control" type="password" />
            <label htmlFor="newPasswordChange">New password</label>
        </div>
        <div className="form-label-group">
            <Field name="confirmPassword" id="confirmPassword" placeholder="Confirm password" required component="input" className="form-control" type="password" />
            <label htmlFor="confirmPassword">Confirm password</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Change Password</button>
        </div>
    </form>

export default reduxForm<any, any>({
    form: 'changePasswordForm'
})(changePasswordForm);