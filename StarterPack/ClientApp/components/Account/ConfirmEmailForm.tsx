import * as React from 'react';
import { Field, reduxForm } from 'redux-form';

const confirmEmailForm = ({ pristine, submitting, handleSubmit }) => 
    <form id="confirmEmailForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-label-group">
            <Field name="email" id="email" placeholder="Email" required component="input" autoFocus className="form-control" type="text" />
            <label htmlFor="email">Email</label>
        </div>
        <div className="form-label-group">
            <Field name="password" id="password" placeholder="Password" required component="input" autoFocus className="form-control" type="password" />
            <label htmlFor="password">Password</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Change Email</button>
        </div>
    </form>

export default reduxForm<any, any>({
    form: 'confirmEmailForm'
})(confirmEmailForm);