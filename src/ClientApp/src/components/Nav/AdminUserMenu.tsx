import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { NavContext } from '../../App';
import { ApplicationState } from '../../store/index';
import * as SessionState from '../../store/Session';

interface NavProps {
    onUpdate: () => void;
}

type AdminUserMenuProps = SessionState.SessionState
    & {
        sessionActions: typeof SessionState.actionCreators;
    };

export class AdminUserMenu extends React.Component<AdminUserMenuProps, {}> {
    public render() {
        const { username, token } = this.props;

        if (username == "")
            return null

        if (token == undefined || Object.keys(token).length === 0)
            return null

        const { claims } = token;
        if (claims && claims.constructor === Array) {
            if (claims.some((claim) => { return claim == "Admin"; })) {
                return <NavContext.Consumer {...this.props}>
                    {({ onUpdate }: NavProps) => (
                        <React.Fragment>
                            <Link key="adminNewItem" className="dropdown-item" to="/admin/item/new" onClick={onUpdate}>
                                <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" size="1x" icon={faLock} /> Admin
                        </Link>
                        </React.Fragment>
                    )}
                </NavContext.Consumer>
            }
        }

        return null
    }
}

export default connect(
    (state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
    (dispatch: Dispatch<SessionState.SessionState>) => { // Selects which action creators are merged into the component's props
        return {
            sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
        };
    },
)(AdminUserMenu) as typeof AdminUserMenu;
