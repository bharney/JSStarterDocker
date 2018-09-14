import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { NavContext } from '../../App';
import * as SessionState from '../../store/Session';
interface NavProps {
    onUpdate: () => void;
}

type AdminNavMenuProps = SessionState.SessionState

export class AdminNavMenu extends React.Component<AdminNavMenuProps, {}> {

    public render() {
        const { username, token } = this.props;

        if (username == "")
            return null

        if (token == undefined)
            return null

        if (Object.keys(token).length === 0)
            return null

        const { claims } = token;
        if (claims && claims.constructor === Array) {
            if (claims.some((claim) => { return claim == "Admin"; })) {
                return <NavContext.Consumer {...this.props}>
                    {({ onUpdate }: NavProps) => (
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Admin</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <NavLink key="nav-admin-users" className="dropdown-item" to={'/admin/users'} onClick={onUpdate} activeClassName='active' href="">Users</NavLink>
                            </div>
                        </li>
                    )}
                </NavContext.Consumer>
            }
        }

        return null
    }
}

export default AdminNavMenu;
