import * as React from 'react';
import { Field, reduxForm } from 'redux-form';

const changeEmailForm = ({ pristine, submitting, handleSubmit }) => 
    <form id="changeEmailForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-label-group">
            <Field name="confirmedEmail" id="confirmedEmail" placeholder="Current email" required component="input" autoFocus className="form-control" type="text" />
            <label htmlFor="confirmedEmail">Current Email</label>
        </div>
        <div className="form-label-group">
            <Field name="unConfirmedEmail" id="unConfirmedEmail" placeholder="New email" required component="input" className="form-control" type="text" />
            <label htmlFor="unConfirmedEmail">New Email</label>
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Change Email</button>
        </div>
    </form>

export default reduxForm<any, any>({
    form: 'changeEmailForm'
})(changeEmailForm);