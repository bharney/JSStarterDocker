import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, NavLink } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    onUpdate = () => {
        window.scrollTo(0, 0);
        let navbar = ReactDOM.findDOMNode<HTMLInputElement>(document.getElementById('slider'));
        if (navbar.classList.contains("active")) {
            navbar.classList.remove("active");
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
        return <nav id="custom-nav"  className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                 <strong><Link className='navbar-brand' onClick={this.onUpdate} to={'/'}><i className="glyphicon glyphicon-home" aria-hidden="true"></i> Home</Link></strong>             
                <button className="navbar-toggler navbar-toggler-right" onClick={this.toggleSlider} type="button"  data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/counter'} onClick={this.onUpdate} exact activeClassName='active'>
                             Counter
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to={'/fetchdata'} onClick={this.onUpdate} exact activeClassName='active'>
                             Fetch Data
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>;
    }
}
