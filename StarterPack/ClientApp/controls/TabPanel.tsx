import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

interface ActiveIndex {
  activeIndex: string;
}

export const TabPanelContext = React.createContext({
  activeIndex: "Account",
  onUpdate: (activeIndex: string) => {}
});

type TabPanelProps = {
  activeIndex: string;
  onUpdate: (activeIndex: string) => void;
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
      {({ onUpdate, activeIndex }) => (
        <li onClick={() => onUpdate(tabIndex)} className="nav-item">
          <a
            href="javascript:void(0)"
            role="button"
            className={`nav-link ${
              tabIndex.toLowerCase() === activeIndex.toLowerCase()
                ? "active"
                : ""
            }`}
          >
            {children}
          </a>
        </li>
      )}
    </TabPanelContext.Consumer>
  );

  tabChange = (activeIndex: string) => {
    this.setState(
      ({ activeIndex }: ActiveIndex) => ({ activeIndex }),
      () => {
        this.props.onUpdate(activeIndex);
        window.scrollTo(0, 0);
      }
    );
  };

  state = {
    activeIndex: this.props.activeIndex || "Account",
    onTabChange: this.tabChange
  };

  render() {
    return (
      <TabPanelContext.Provider
        value={{
          onUpdate: this.tabChange,
          activeIndex: this.state.activeIndex
        }}
      >
        {this.props.children}
      </TabPanelContext.Provider>
    );
  }
}
export default TabPanel;
