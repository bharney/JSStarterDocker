import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import * as ReactDOM from 'react-dom';
import NavMenu from './components/NavMenu';
import { ApplicationState } from './store';
import Footer from './components/Footer';
import routes from './routes'
import * as RoutesModule from './routes';
import { Layout } from './components/Layout';
import NotFound from './components/NotFound';
import { hot } from 'react-hot-loader';

type AppProps = any

interface On {
    on: boolean;
}
export const NavContext = React.createContext({ on: false, toggle: () => { }, onUpdate: () => { }, handleOverlayToggle: (e) => { } })

type NavMenuProps = ApplicationState
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
                    let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar'));
                    if (sidebar) {
                        (sidebar as HTMLElement).removeAttribute("style");
                    }
                    document.getElementsByTagName("html")[0].style.overflowY = "auto";
                })
        }
    }

    toggle = () => {
        this.setState(
            ({ on }: On) => ({ on: !on }),
            () => {
                let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar')) as HTMLElement;
                let bounding = sidebar.getBoundingClientRect()
                let offset = bounding.top + document.body.scrollTop
                if (this.state.on) {
                    let totalOffset = ((offset - 100) * -1);
                    totalOffset = totalOffset < 0 ? 0 : totalOffset;
                    (sidebar as HTMLElement).style.top = totalOffset + "px";
                    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
                } else {
                    if (sidebar) {
                        (sidebar as HTMLElement).removeAttribute("style");
                    }
                    document.getElementsByTagName("html")[0].style.overflowY = "auto";
                }
            },
        )
    }
    onUpdate = () => {
        this.setState(
            ({ on }: On) => ({ on: false }),
            () => {
                let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar'));
                if (sidebar) {
                    (sidebar as HTMLElement).removeAttribute("style");
                }
                document.getElementsByTagName("html")[0].style.overflowY = "auto";
                window.scrollTo(0, 0);
            },
        )
    };
    handleOverlayToggle = (e) => {
        if (e.target.classList.contains("overlay") || e.target.classList.contains("subMenu")) {
            this.setState(
                ({ on }: On) => ({ on: false }),
                () => {
                    let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar'));
                    if (sidebar) {
                        (sidebar as HTMLElement).removeAttribute("style");
                    }
                    document.getElementsByTagName("html")[0].style.overflowY = "auto";
                },
            )
        }
    }
    render() {
        return <React.Fragment>
            <NavContext.Provider value={{
                on: this.state.on,
                toggle: this.toggle,
                onUpdate: this.onUpdate,
                handleOverlayToggle: this.handleOverlayToggle
            }}>
                <NavMenu {...this.props as NavMenuProps} />
                <Switch>
                    {routes.map(({ path, exact, component: Component, ...rest }) => (
                        <Route key={path} path={path} exact={exact} render={(props) => (
                            <Layout {...rest} {...props}>
                                <Component {...props} />
                            </Layout>
                        )} />
                    ))}
                    <Route render={(props) => <NotFound {...props} />} />
                </Switch>
                <Footer />
            </ NavContext.Provider>
        </React.Fragment>
    }
}

export default App;

