import * as React from 'react';
import * as SessionState from '../../store/Session';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { ApplicationState } from '../../store';
import { ExpandableListGroup } from '../../controls/ExpandableListGroup';
import { NavContext } from '../../App';
interface NavProps {
    onUpdate: () => void;
}

type AdminSliderMenuProps = SessionState.SessionState;

export class AdminSliderMenu extends React.Component<AdminSliderMenuProps, {}> {
    public render() {
        const { token } = this.props;
        if (token == undefined)
            return null

        if (Object.keys(token).length === 0)
            return null
        const { claims } = token;
        if (claims && claims.constructor === Array) {
            if (claims.some((claim) => { return claim == "Admin"; })) {
                return <NavContext.Consumer {...this.props}>
                    {({ onUpdate }: NavProps) => (
                        <ExpandableListGroup displayTitle="Admin" id={1} key="adminSliderMenu">
                            <NavLink key="adminItems" to={'/admin/items'} href="" className="list-group-item root" onClick={onUpdate} activeClassName='active'>Items</NavLink>
                            <NavLink key="adminOrders" to={'/admin/orders'} href="" className="list-group-item root" onClick={onUpdate} activeClassName='active'>Orders</NavLink>
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
