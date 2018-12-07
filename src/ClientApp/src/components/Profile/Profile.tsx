import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch, bindActionCreators } from "redux";
import { ProfileViewModel } from "../../models";
import { ApplicationState } from "../../store";
import * as AlertState from "../../store/Alert";
import * as ProfileState from "../../store/Profile";
import * as SessionState from "../../store/Session";
import Loading from "../Common/Loading";

type ProfileProps = ProfileState.ProfileState &
  SessionState.SessionState & {
    profileActions: typeof ProfileState.actionCreators;
    alertActions: typeof AlertState.actionCreators;
    sessionActions: typeof SessionState.actionCreators;
  } & RouteComponentProps<{}>;
// At runtime, Redux will merge together...

class Profile extends React.Component<ProfileProps, any> {
  componentDidMount() {
    this.props.profileActions.getProfile();
  }

  render() {
    const { isLoading } = this.props;
    const profile = this.props.profile as ProfileViewModel;
    return isLoading ? (
      <Loading />
    ) : (
      <div className="container pt-4">
        <div className="row justify-content-center">
          <div className="col-12 form-wrapper">
            <h2 className="text-center display-4">Profile.</h2>
          </div>
          <div className="col-12 col-sm-8 col-md-8 col-lg-5 text-center form-wrapper">
            <img
              className="img-fluid"
              src={profile.imageUrl}
              alt="Profile Image"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-8 col-lg-5 form-wrapper">
            <div className="form-group">
              <label htmlFor="email" className="form-control-label">
                Email
              </label>
              <p>{profile.email}</p>
            </div>
            <div className="form-group">
              <label htmlFor="firstName" className="form-control-label">
                First Name
              </label>
              <p>{profile.firstName}</p>
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-control-label">
                Last Name
              </label>
              <p>{profile.lastName}</p>
            </div>
            <div className="form-group">
              <div className="row justify-content-center">
                <div className="col-6 form-wrapper">
                  <button
                    className="btn btn-lg btn-primary btn-block"
                    onClick={() => this.props.history.push("/Profile/Edit")}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.profile,
  (
    dispatch:
      | Dispatch<ProfileState.ProfileState>
      | Dispatch<SessionState.SessionState>
      | Dispatch<AlertState.AlertState>
  ) => {
    return {
      profileActions: bindActionCreators(ProfileState.actionCreators, dispatch),
      alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
    };
  }
)(Profile) as typeof Profile;
