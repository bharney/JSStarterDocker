import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, RouteComponentProps } from 'react-router';
import Footer from './components/Footer/Footer';
import NavMenu from './components/Nav/NavMenu';
import { ApplicationState } from './store/index';
import * as AccountState from './store/Account';
import * as AlertState from './store/Alert';
import * as SessionState from './store/Session';

type AppProps = any

interface On {
    on: boolean;
}
export const NavContext = React.createContext({ on: false, toggle: () => { }, onUpdate: () => { }, handleOverlayToggle: (e) => { } })

type NavMenuProps = ApplicationState
    & {
    accountActions: typeof AccountState.actionCreators,
    sessionActions: typeof SessionState.actionCreators,
    alertActions: typeof AlertState.actionCreators;
}
    & RouteComponentProps<{}>;
export class App extends React.Component<AppProps, {}> {
    state = { on: false }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        if (window.innerWidth > 767) {
            this.setState(
                ({ on }: On) => ({ on: false }),
                () => {
                    this.handleSidebarToggle()
                })
        }
    }

    toggle = () => {
        this.setState(
            ({ on }: On) => ({ on: !on }),
            () => {
                if (this.state.on) {
                    this.handleSidebarPosition();
                } else {
                    this.handleSidebarToggle()
                }
            },
        )
    }
    onUpdate = () => {
        this.setState(
            ({ on }: On) => ({ on: false }),
            () => {
                this.handleSidebarToggle()
                window.scrollTo(0, 0);
            },
        )
    };
    handleOverlayToggle = (e) => {
        if (e.target.classList.contains("overlay") || e.target.classList.contains("subMenu")) {
            this.setState(
                ({ on }: On) => ({ on: false }),
                () => {
                    this.handleSidebarToggle()
                },
            )
        }
    }
    private handleSidebarPosition() {
        let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar')) as HTMLElement;
        let bounding = sidebar.getBoundingClientRect();
        let offset = bounding.top + document.body.scrollTop;
        let totalOffset = ((offset - 100) * -1);
        totalOffset = totalOffset < 0 ? 0 : totalOffset;
        (sidebar as HTMLElement).style.top = totalOffset + "px";
        document.getElementsByTagName("html")[0].style.overflowY = "hidden";
    }

    private handleSidebarToggle() {
        let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar'));
        if (sidebar) {
            (sidebar as HTMLElement).removeAttribute("style");
        }
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
    }

    render() {
        const { component: Component,
            layout: Layout,
            session,
            sessionActions,
            alertActions,
            accountActions,
            ...rest } = this.props;

        return <Route {...rest} render={props => (
            <React.Fragment>
                <NavContext.Provider value={{
                    on: this.state.on,
                    toggle: this.toggle,
                    onUpdate: this.onUpdate,
                    handleOverlayToggle: this.handleOverlayToggle
                }}>
                    <NavMenu accountActions={accountActions}
                        alertActions={alertActions}
                        sessionActions={sessionActions}
                        {...session} />
                    <this.props.layout {...rest} {...props}>
                        <this.props.component {...props} />
                    </this.props.layout>
                    <Footer />
                </ NavContext.Provider>
            </React.Fragment>
        )} />
    }
}

export default App;

