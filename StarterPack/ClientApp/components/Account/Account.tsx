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
import TabPanel from '../../controls/TabPanel';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import Profile from '../Profile/Profile';

type AccountProps = ProfileState.ProfileState
    & SessionState.SessionState
    & {
        profileActions: typeof ProfileState.actionCreators,
        alertActions: typeof AlertState.actionCreators,
        sessionActions: typeof SessionState.actionCreators
    }
    & RouteComponentProps<{}>;

class Account extends React.Component<AccountProps, any> {
    state = { currentTab: 1 };

    onUpdate = (activeIndex: number) => {
        this.setState({ currentTab: activeIndex });
    };
        
    render() {
        const AppleContent = () => (
            <div className="tabContent">
                <p>This is a demo of apple</p>
            </div>
        );

        const LinuxContent = () => (
            <div className="col-12 form-wrapper">
                <h2 className="text-center display-4">Account.</h2>
            </div>
        );

        const { isLoading } = this.props;
        return isLoading ? <div className="container pt-4" style={{ height: "70vh" }}><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" style={{ position: "absolute", top: "7vh", left: "50%", fontSize: "45px" }} icon={faSpinner} spin /></div> :
            <div className="container pt-4">
            <div className="row justify-content-center pt-4">
                <div className="col-12">
                    <TabPanel activeIndex={this.state.currentTab}
                        onUpdate={this.onUpdate}
                        {...this.props} >
                        <TabPanel.TabBar>
                            <TabPanel.Tab tabIndex={1}>
                                Account
                </TabPanel.Tab>
                            <TabPanel.Tab tabIndex={2}>
                                Profile
                </TabPanel.Tab>
                        </TabPanel.TabBar>
                        <TabPanel.Content>
                            {this.state.currentTab === 1 ? <LinuxContent /> : null}
                            {this.state.currentTab === 2 ? <Profile {...this.props} /> : null}
                        </TabPanel.Content>
                    </TabPanel>
                </div>
            </div>
        </div>;
    }
}

export default connect(null, null)(Account) as typeof Account;
