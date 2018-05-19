import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import asyncComponent from './AsyncComponent';
import * as ReactDOM from 'react-dom';
import NavMenu from './NavMenu';
import { ApplicationState } from '../store';
import Footer from './Footer';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

type AppRouteProps = any

interface On {
    on: boolean;
}
export const NavContext = React.createContext({ on: false, toggle: () => { }, onUpdate: () => { }, handleOverlayToggle: (e) => { } })

type NavMenuProps = ApplicationState
    & RouteComponentProps<{}>;
export class AppRoute extends React.Component<AppRouteProps, {}> {
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

    toggleSlider = () =>
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
        const { component: Component, layout: Layout, ...rest } = this.props;
        return <Route {...rest} render={props => (
            <React.Fragment>
                <NavContext.Provider value={{
                    on: this.state.on,
                    toggle: this.toggleSlider,
                    onUpdate: this.onUpdate,
                    handleOverlayToggle: this.handleOverlayToggle
                }}>
                    <NavMenu {...props as NavMenuProps} />
                    <this.props.layout {...rest} {...props}>
                        <this.props.component {...props} />
                    </this.props.layout>
                    <Footer />
                </ NavContext.Provider>
            </React.Fragment>

        )} />
    }
}
export default AppRoute;

