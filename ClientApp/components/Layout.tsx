import * as React from 'react';
import { SliderMenu } from './SliderMenu';
import { NavContext } from './AppRoute';
interface NavProps {
    on: boolean;
    handleOverlayToggle: (e) => void;
}

export class Layout extends React.Component<{}, {}> {
    public render() {
        return <NavContext.Consumer>
            {({ on, handleOverlayToggle }: NavProps) => (
                <React.Fragment>
                    <main onClick={(e) => handleOverlayToggle(e)} className={`container ${on ? " overlay" : ""}`}>
                        <div id="slider" className={`row row-offcanvas row-offcanvas-right content ${on ? " active" : ""}`}>
                            <div className="col-12 col-md-12 col-lg-9">
                                {this.props.children}
                            </div>
                            <div id="sidebar" className="col-8 col-md-0 col-lg-3 sidebar-offcanvas">
                                <div className="list-group">
                                    <SliderMenu />
                                </div>
                            </div>
                        </div>
                    </main>
                </React.Fragment>)}
        </NavContext.Consumer>
    }
}

export default Layout;
