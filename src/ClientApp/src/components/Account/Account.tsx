import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import TabPanel from "../../controls/TabPanel";
import * as AccountState from "../../store/Account";
import * as AlertState from "../../store/Alert";
import * as ProfileState from "../../store/Profile";
import * as SessionState from "../../store/Session";
import Loading from "../Common/Loading";
import Profile from "../Profile/Profile";
import AccountManagement from "./AccountManagement";
type AccountManagementProps = AccountState.AccountState
  & {
    accountActions: typeof AccountState.actionCreators
} & RouteComponentProps<{}>;

type AccountProps = ProfileState.ProfileState &
  SessionState.SessionState & {
    profileActions: typeof ProfileState.actionCreators;
    alertActions: typeof AlertState.actionCreators;
    sessionActions: typeof SessionState.actionCreators;
    accountActions: typeof AccountState.actionCreators;
  } & RouteComponentProps<{}>;

class Account extends React.Component<AccountProps, any> {
  state = { currentTab: this.props.location.pathname.substr(1) };

  onUpdate = (activeIndex: string) => {
    this.setState({ currentTab: activeIndex });
    this.props.history.push(activeIndex);
  };

  render() {
    const { isLoading } = this.props;
    return isLoading ? (
      <Loading />
    ) : (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <TabPanel
              activeIndex={this.state.currentTab}
              onUpdate={this.onUpdate}
              {...this.props}
            >
              <TabPanel.TabBar>
                <TabPanel.Tab tabIndex={`Account`}>Account</TabPanel.Tab>
                <TabPanel.Tab tabIndex={`Profile`}>Profile</TabPanel.Tab>
              </TabPanel.TabBar>
              <TabPanel.Content>
                {this.state.currentTab.toLowerCase() === "account" ? (
                  <AccountManagement
                    {...this.props as AccountManagementProps}
                  />
                ) : null}
                {this.state.currentTab.toLowerCase() === "profile" ? (
                  <Profile {...this.props} />
                ) : null}
              </TabPanel.Content>
            </TabPanel>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, null)(Account) as typeof Account;
