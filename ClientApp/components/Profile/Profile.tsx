import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { connect } from 'react-redux';
import * as SessionState from '../../store/Session';
import * as ProfileState from '../../store/Profile';
import { bindActionCreators, Dispatch } from 'redux';
import * as AlertState from '../../store/Alert';
import { IndexViewModel, AlertType, Field as ModelField } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import ProfileForm from './ProfileForm';

type ProfileProps =
    ProfileState.ProfileState
    & SessionState.SessionState
    & {
        profileActions: typeof ProfileState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
        sessionActions: typeof SessionState.actionCreators
    }
    & RouteComponentProps<{}>;
// At runtime, Redux will merge together...


class Profile extends React.Component<ProfileProps, any> {
    componentDidMount() {
        this.props.profileActions.getProfile()
        document.getElementsByTagName("input")[0].focus();
    }

    render() {
        const { isLoading, profile } = this.props;
        return isLoading ? <div className="container pt-4" style={{ height: "70vh" }}><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" style={{ position: "absolute", top: "7vh", left: "50%", fontSize: "45px" }} icon={faSpinner} spin /></div> :
            <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-md-8 col-lg-6">
                        <h2 className="text-center display-4">Profile.</h2>
                        <ProfileForm form='itemForm'
                            enableReinitialize={true}
                            initialValues={profile}
                            onSubmit={(values: IndexViewModel) => {
                                this.props.profileActions.updateProfile(values, () => {
                                    this.props.alertActions.sendAlert('Your profile was saved successfully.', AlertType.success, true);
                                    });
                            }}
                            {...this.props} />
                </div>
            </div>
        </div>;
    }
}



export default connect(
    (state: ApplicationState) => state.profile,
    (dispatch: Dispatch<ProfileState.ProfileState> | Dispatch<SessionState.SessionState> | Dispatch<AlertState.AlertState>) => {
        return {
            profileActions: bindActionCreators(ProfileState.actionCreators, dispatch),
            alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
        }
    }
)(Profile) as typeof Profile;
