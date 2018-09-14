import * as React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NavContext } from '../../App';
import { ExpandableListGroup } from '../../controls/ExpandableListGroup';
import { ApplicationState } from '../../store';
import * as SessionState from '../../store/Session';
interface NavProps {
    onUpdate: () => void;
}

type AdminSliderMenuProps = SessionState.SessionState;

export class AdminSliderMenu extends React.Component<AdminSliderMenuProps, {}> {
    public render() {
        const { username, token } = this.props;
        if (username == "")
            return null

        if (token == undefined)
            return null

        if (Object.keys(token).length === 0)
            return null
        const { claims } = token

        if (claims && claims.constructor === Array) {
            if (claims.some((claim) => { return claim == "Admin"; })) {
                return <NavContext.Consumer {...this.props}>
                    {({ onUpdate }: NavProps) => (
                        <ExpandableListGroup displayTitle="Admin" id={1} key="adminSliderMenu">
                            <NavLink key="adminUsers" to={'/admin/users'} href="" className="list-group-item root" onClick={onUpdate} activeClassName='active'>Users</NavLink>
                        </ExpandableListGroup>
                    )}
                </NavContext.Consumer>
            }
        }

        return null;
    }
}

export default connect((state: ApplicationState) => state.session, null)
    (AdminSliderMenu) as typeof AdminSliderMenu;
