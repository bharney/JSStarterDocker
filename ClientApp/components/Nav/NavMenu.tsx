import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { bindActionCreators } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { NavContext } from '../../App';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as SessionState from '../../store/Session';
import UserMenu from '../Nav/UserMenu';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import MemberNavMenu from '../Nav/MemberNavMenu';

type NavMenuProps = ApplicationState
    & {
        accountActions: typeof AccountState.actionCreators,
        sessionActions: typeof SessionState.actionCreators,
        alertActions: typeof AlertState.actionCreators;
    }
    & RouteComponentProps<{}>;

interface NavProps {
    onUpdate: () => void;
    toggle: () => void;
}
export class NavMenu extends React.Component<NavMenuProps, {}> {
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let navbar = ReactDOM.findDOMNode(document.getElementById('custom-nav')) as HTMLElement
        let windowsScrollTop = window.pageYOffset;
        if (windowsScrollTop > 50) {
            navbar.classList.add("affix");
            navbar.classList.remove("top-nav-collapse");
        } else {
            navbar.classList.remove("affix");
            navbar.classList.remove("top-nav-collapse");
        }
    }

    public render() {
        return <NavContext.Consumer>
            {({ onUpdate, toggle }: NavProps) => {
                return <nav id="custom-nav" className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                    <strong><Link className='navbar-brand' onClick={onUpdate} to={'/'}><FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" icon={faHome} size="1x" /> Home</Link></strong>
                    <button className="navbar-toggler navbar-toggler-right" onClick={toggle} type="button" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to={'/counter'} onClick={onUpdate} exact activeClassName='active'>
                                    Counter
                            </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={'/fetchdata'} onClick={onUpdate} exact activeClassName='active'>
                                    Fetch Data
                            </NavLink>
                            </li>
                            <MemberNavMenu sessionActions={this.props.sessionActions} {...this.props.session} />
                        </ul>
                        <div className="d-none d-md-block d-lg-block d-xl-block">
                            <UserMenu {...this.props} />
                        </div>
                    </div>
                </nav>
            }}
        </NavContext.Consumer>
    }
}

export default NavMenu;
