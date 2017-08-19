import * as React from 'react';
import { NavMenu } from './NavMenu';
import { SliderMenu } from './SliderMenu';
import { Footer } from './Footer';

export class Layout extends React.Component<{}, {}> {
    public render() {
        return <div>
                    <NavMenu />
                    <main className="container pad-top">
                        <div id="slider" className="row row-offcanvas row-offcanvas-right">
                            <div className="col-12 col-md-9">
                                {this.props.children}
                            </div>
                            <SliderMenu />
                        </div>
                    </main>
                    <Footer />
               </div>;
    }
}
