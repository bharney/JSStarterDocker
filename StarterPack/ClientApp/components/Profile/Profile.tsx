import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { connect } from 'react-redux';
import * as SessionState from '../../store/Session';
import * as ProfileState from '../../store/Profile';
import { bindActionCreators, Dispatch } from 'redux';
import * as AlertState from '../../store/Alert';
import { Profile as ProfileModel, AlertType, Field as ModelField } from '../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';

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
        debugger;

        this.props.profileActions.getProfile()
    }

    render() {
        const { isLoading } = this.props;
        const profile = this.props.profile as ProfileModel;
        return isLoading ? <div className="container pt-4" style={{ height: "70vh" }}><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" style={{ position: "absolute", top: "7vh", left: "50%", fontSize: "45px" }} icon={faSpinner} spin /></div> :
            <div className="container pt-4">
                <div className="row justify-content-center pt-4">
                    <div className="col-12 col-sm-8 col-md-8 col-lg-6 form-wrapper">
                        <h2 className="text-center display-4">Profile.</h2>
                    </div>
                    <div className="col-12 col-sm-8 col-md-8 col-lg-4 form-wrapper">
                        <img className="first-slide img-fluid" src={profile.imageUrl} alt="Profile Image" />
                        <div className="form-group">
                            <label htmlFor="email" className="form-control-label">Email</label>
                            <p>{profile.email}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-control-label">First Name</label>
                            <p>{profile.firstName}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-control-label">Last Name</label>
                            <p>{profile.lastName}</p>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-lg btn-primary btn-block" onClick={() => this.props.history.push("/Profile/Edit")}>Edit Profile</button>
                        </div>
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
