import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Dispatch, connect } from "react-redux";
import { Link, NavLink, RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { NavContext } from "../../App";
import * as AccountState from "../../store/Account";
import * as AlertState from "../../store/Alert";
import * as SessionState from "../../store/Session";
import MemberNavMenu from "../Nav/MemberNavMenu";
import UserMenu from "../Nav/UserMenu";

type NavMenuProps = SessionState.SessionState & {
  accountActions: typeof AccountState.actionCreators;
  sessionActions: typeof SessionState.actionCreators;
  alertActions: typeof AlertState.actionCreators;
} & RouteComponentProps<{}>;
type UserMenuProps = SessionState.SessionState & {
  accountActions: typeof AccountState.actionCreators;
  sessionActions: typeof SessionState.actionCreators;
  alertActions: typeof AlertState.actionCreators;
};

interface NavProps {
  onUpdate: () => void;
  toggle: () => void;
}
export class NavMenu extends React.Component<NavMenuProps, {}> {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    let navbar = ReactDOM.findDOMNode(
      document.getElementById("custom-nav")
    ) as HTMLElement;
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
    const {
      sessionActions,
      alertActions,
      accountActions,
      isLoading
    } = this.props;
    return (
      <NavContext.Consumer>
        {({ onUpdate, toggle }: NavProps) => {
          return (
            !isLoading && (
              <nav
                id="custom-nav"
                className="navbar navbar-expand-md fixed-top navbar-dark bg-dark"
              >
                <div className="container nav-links">
                  <strong>
                    <Link className="navbar-brand" onClick={onUpdate} to={"/"}>
                      <FontAwesomeIcon
                        className="svg-inline--fa fa-w-16 fa-lg"
                        icon={faHome}
                        size="1x"
                      />{" "}
                      Home
                    </Link>
                  </strong>
                  <div
                    className="collapse navbar-collapse"
                    id="navbarsExampleDefault"
                  >
                    <ul className="navbar-nav mr-auto">
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          to={"/counter"}
                          onClick={onUpdate}
                          exact
                          activeClassName="active"
                        >
                          Counter
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link"
                          to={"/fetchdata"}
                          onClick={onUpdate}
                          exact
                          activeClassName="active"
                        >
                          Fetch Data
                        </NavLink>
                      </li>
                      <MemberNavMenu
                        sessionActions={sessionActions}
                        {...this.props}
                      />
                    </ul>
                    <div className="d-none d-md-block d-lg-block d-xl-block">
                      <ul className="navbar-nav">
                        <UserMenu
                          accountActions={accountActions}
                          alertActions={alertActions}
                          sessionActions={sessionActions}
                          {...this.props}
                        />
                      </ul>
                    </div>
                  </div>
                  <div className="d-inline-flex">
                    <div className="d-md-none d-lg-none d-xl-none">
                      <ul className="navbar-nav">
                        <UserMenu
                          accountActions={accountActions}
                          alertActions={alertActions}
                          sessionActions={sessionActions}
                          {...this.props}
                        />
                      </ul>
                    </div>
                    <button
                      className="navbar-toggler navbar-toggler-right"
                      onClick={toggle}
                      type="button"
                      data-target="#navbarsExampleDefault"
                      aria-controls="navbarsExampleDefault"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="navbar-toggler-icon" />
                    </button>
                  </div>
                </div>
              </nav>
            )
          );
        }}
      </NavContext.Consumer>
    );
  }
}

export default connect(
  (state: SessionState.SessionState) => {
    return state;
  }, // Selects which state properties are merged into the component's props
  (
    dispatch:
      | Dispatch<SessionState.SessionState>
      | Dispatch<AlertState.AlertState>
      | Dispatch<AccountState.AccountState>
  ) => {
    // Selects which action creators are merged into the component's props
    return {
      sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
      alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
      accountActions: bindActionCreators(AccountState.actionCreators, dispatch)
    };
  }
)(NavMenu) as typeof NavMenu;
