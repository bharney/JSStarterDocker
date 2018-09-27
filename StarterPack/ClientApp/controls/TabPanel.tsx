import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface ActiveIndex {
    activeIndex: number;
}

export const TabPanelContext = React.createContext({ activeIndex: 1, onUpdate: (activeIndex: number) => { } })

type TabPanelProps = & {
    activeIndex: number,
    onUpdate: (activeIndex: number) => void
} & RouteComponentProps<{}>;

export class TabPanel extends React.Component<TabPanelProps, {}> {

    static Content = ({ children }) => children;

    static TabBar = ({ children, ...props }) => (
        <ul className="nav nav-tabs" {...props}>
            {children}
        </ul>
    );

    static Tab = ({ children, tabIndex }) => (
        <TabPanelContext.Consumer>
            {({ onUpdate, activeIndex }) => {
                debugger;
               return  <li onClick={() => onUpdate(tabIndex)} className="nav-item">
                    <a href="javascript:void(0)" role="button" className={`nav-link ${tabIndex === activeIndex ? "active" : ""}`} >
                        {children}
                    </a>
                </li>
            }}
        </TabPanelContext.Consumer>
    );

    tabChange = (activeIndex: number) => {
        this.setState(({ activeIndex }: ActiveIndex) => ({ activeIndex }),
            () => {
                this.props.onUpdate(activeIndex)
                window.scrollTo(0, 0);
            });
    };

    state = {
        activeIndex: this.props.activeIndex || 1,
        onTabChange: this.tabChange
    }

    render() {
        debugger;

        const { ...rest } = this.props;

        return (
            <TabPanelContext.Provider value={{
                onUpdate: this.tabChange,
                activeIndex: this.state.activeIndex
            }}>
                    {this.props.children}
                
            </TabPanelContext.Provider>
        );
    }
}
export default TabPanel;