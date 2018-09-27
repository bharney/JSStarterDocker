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

type AccountProps = RouteComponentProps<{}>;
// At runtime, Redux will merge together...


class Account extends React.Component<AccountProps, {}> {
    state = { activeIndex: 1 };

    onUpdate = (activeIndex: number) => {
        this.setState({ currentTab: activeIndex });
    };

    render() {

        const Contacts = () => (
            <div className="tabContent">
                <ul>
                    <li>contact 1 </li>
                    <li>contact 2 </li>
                    <li>contact 3 </li>
                </ul>
            </div>
        );

        const AppleContent = () => (
            <div className="tabContent">
                <p>This is a demo of apple</p>
            </div>
        );

        const LinuxContent = () => (
            <div className="tabContent">
                <p>Lets go Linux</p>
            </div>
        );

        return (<TabPanel activeIndex={this.state.activeIndex}
            onUpdate={this.onUpdate}
            {...this.props} >
            <TabPanel.TabBar>
                <TabPanel.Tab tabIndex={1}>
                    Contacts
                    </TabPanel.Tab>
                <TabPanel.Tab tabIndex={2}>
                    world
                    </TabPanel.Tab>
                <TabPanel.Tab tabIndex={3}>
                    Hello
                    </TabPanel.Tab>
            </TabPanel.TabBar>
            <TabPanel.Content>
                {this.state.activeIndex === 1 ? <Contacts /> : null}
                {this.state.activeIndex === 2 ? <LinuxContent /> : null}
                {this.state.activeIndex === 3 ? <AppleContent /> : null}
            </TabPanel.Content>
        </TabPanel>
        );
    }
}

export default connect(null, null)(Account) as typeof Account;
