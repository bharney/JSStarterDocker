import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { RouteComponentProps, Link } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux';
import { AlertType } from '../../models';
import * as AccountState from '../../store/Account';
import * as SessionState from '../../store/Session';
import * as AlertState from '../../store/Alert';
import * as ReactDOM from 'react-dom';
import MemberUserMenu from './MemberUserMenu';

type UserMenuProps = ApplicationState
    & {
        accountActions: typeof AccountState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators;
    }
    & RouteComponentProps<{}>;


export class UserMenu extends React.Component<UserMenuProps, {}> {
    public render() {
        return <ul className="navbar-nav">
                <MemberUserMenu sessionActions={this.props.sessionActions} 
                                        alertActions={this.props.alertActions} 
                                        accountActions={this.props.accountActions} 
                                    {...this.props.session} />
            </ul>;
    }
}

export default UserMenu;