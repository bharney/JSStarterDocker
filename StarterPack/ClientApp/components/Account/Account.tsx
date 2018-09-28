import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from "react";
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { ProfileViewModel } from '../../models';
import { ApplicationState } from '../../store';
import * as AlertState from '../../store/Alert';
import * as ProfileState from '../../store/Profile';
import * as SessionState from '../../store/Session';
import * as AccountState from '../../store/Account';
import TabPanel from '../../controls/TabPanel';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import Profile from '../Profile/Profile';
import AccountManagement from './AccountManagement';
type AccountManagementProps = AccountState.AccountState
    & RouteComponentProps<{}>;

type AccountProps = ProfileState.ProfileState
    & SessionState.SessionState
    & {
        profileActions: typeof ProfileState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
        sessionActions: typeof SessionState.actionCreators
    }
    & RouteComponentProps<{}>;

class Account extends React.Component<AccountProps, any> {
    state = { currentTab: "Account" };

    componentDidMount() {
        debugger;
        let currentTab = this.props.location.pathname;
        if (currentTab.charAt(0) == "/") currentTab = currentTab.substr(1);
        this.setState({ currentTab });
    }

    onUpdate = (activeIndex: string) => {
        this.setState({ currentTab: activeIndex });
        this.props.history.push(activeIndex);
    };
        
    render() {
        const AppleContent = () => (
            <div className="tabContent">
                <p>This is a demo of apple</p>
            </div>
        );
        const { isLoading } = this.props;
        return isLoading ? <div className="container pt-4" style={{ height: "70vh" }}><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" style={{ position: "absolute", top: "7vh", left: "50%", fontSize: "45px" }} icon={faSpinner} spin /></div> :
            <div className="container">
            <div className="row justify-content-center">
                <div className="col-12">
                    <TabPanel activeIndex={this.state.currentTab}
                        onUpdate={this.onUpdate}
                        {...this.props} >
                        <TabPanel.TabBar>
                            <TabPanel.Tab tabIndex={`Account`}>
                                Account
                </TabPanel.Tab>
                                <TabPanel.Tab tabIndex={`Profile`}>
                                Profile
                </TabPanel.Tab>
                        </TabPanel.TabBar>
                            <TabPanel.Content>
                                {this.state.currentTab.toLowerCase() === "account" ? <AccountManagement {...this.props as AccountManagementProps} /> : null}
                                {this.state.currentTab.toLowerCase() === "profile" ? <Profile {...this.props} /> : null}
                        </TabPanel.Content>
                    </TabPanel>
                </div>
            </div>
        </div>;
    }
}

export default connect(null, null)(Account) as typeof Account;
