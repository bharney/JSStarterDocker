import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, RouteComponentProps } from 'react-router';

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
        <div className="tabBar" {...props}>
            {children}
        </div>
    );

    static Tab = ({ children, tabIndex }) => (
        <TabPanelContext.Consumer>
            {({ onUpdate, activeIndex }) => (
                <div onClick={() => onUpdate(tabIndex)}
                    className={`tab ${tabIndex === activeIndex ? "active" : ""}`} >
                    {children}
                </div>
            )}
        </TabPanelContext.Consumer>
    );

    tabChange = (activeIndex: number) => {
        this.setState({ activeIndex },
            () => this.props.onUpdate(activeIndex));
    };

    state = {
        activeIndex: this.props.activeIndex || 1,
        onTabChange: this.tabChange,
    }

    onUpdate = (activeIndex: number) => {
        this.setState(
            ({ activeIndex }: ActiveIndex) => ({ activeIndex }),
            () => {
                window.scrollTo(0, 0);
            },
        )
    };

    render() {
        const { ...rest } = this.props;

        return <React.Fragment>
            <TabPanelContext.Provider value={{
                onUpdate: this.onUpdate,
                activeIndex: this.state.activeIndex,
            }}>
                {this.props.children}
            </TabPanelContext.Provider>
        </React.Fragment>
    }
}
export default TabPanel;