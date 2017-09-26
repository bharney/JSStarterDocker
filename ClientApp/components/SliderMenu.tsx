import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, NavLink } from 'react-router-dom';

export class SliderMenu extends React.Component<{}, {}> {
    onUpdate = () => {
        window.scrollTo(0, 0);
        let navbar = ReactDOM.findDOMNode<HTMLInputElement>(document.getElementById('slider'));
        if (navbar.classList.contains("active")) {
            navbar.classList.remove("active");
        } else {
                navbar.classList.add("active");
        }
    };
    handleScroll() {
        let navbar = ReactDOM.findDOMNode<HTMLInputElement>(document.getElementById('custom-nav'))
        let bounding = navbar.getBoundingClientRect()
        let offset = bounding.top + document.body.scrollTop
        let windowsScrollTop = window.pageYOffset;
        if (offset > 50) {
            navbar.classList.add("affix");
            navbar.classList.remove("top-nav-collapse");
        } else {
            navbar.classList.remove("affix");
            navbar.classList.remove("top-nav-collapse");
        }
    }
    toggleSlider = () => {
            let navbar = ReactDOM.findDOMNode<HTMLInputElement>(document.getElementById('slider'));
            if (navbar.classList.contains("active")) {
                navbar.classList.remove("active");
            } else {
                 navbar.classList.add("active");
            }
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    public render() {
        return <div className="col-6 col-md-3 sidebar-offcanvas" id="sidebar">
                    <div className="list-group">
                        <NavLink className="list-group-item" to={'/counter'} onClick={this.onUpdate} activeClassName='active'>
                                Counter
                        </NavLink>
                        <NavLink className="list-group-item" to={'/fetchdata'} onClick={this.onUpdate} activeClassName='active'>
                                Fetch Data
                        </NavLink>
                    </div>
                </div>;
    }
}
