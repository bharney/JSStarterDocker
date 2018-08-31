import * as React from 'react';
import { Field, reduxForm, GenericField } from 'redux-form';
import { Link } from 'react-router-dom';
import renderFileInput from '../../controls/RenderFileInput';

const DropDownMenu = Field as new () => GenericField<any>;
const InputField = Field as new () => GenericField<any>;

interface DropDownProps {
    options: any;
    id: string; 
    placeholder: string; 
    className: string;
    required: boolean
}

class DropDown extends Field<DropDownProps> { }

const profileForm = ({ pristine, submitting, handleSubmit, ...props }) => {
    return (<form id="profileForm" className='form-wrapper' onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="firstName" className="form-control-label">First Name</label>
            <Field name="firstName" id="firstName" placeholder="First Name" required component="input" className="form-control" type="text" />
        </div>
        <div className="form-group">
            <label htmlFor="lastName" className="form-control-label">Last Name</label>
            <Field name="lastName" id="lastName" placeholder="Last Name" required component="input" className="form-control" type="text" />
        </div>
        <div className="form-group">
            <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={pristine || submitting}>Next</button>
        </div>
    </form>);
}

export default reduxForm<{}, {}>({
    form: 'profileForm',
    destroyOnUnmount: false, //        <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(profileForm);