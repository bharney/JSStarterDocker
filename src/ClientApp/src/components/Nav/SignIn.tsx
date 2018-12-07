import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { NavContext } from '../../App';


interface NavProps {
    onUpdate: () => void;
}

type UserMenuProps = any
export class SignIn extends React.Component<UserMenuProps, {}> {

    public render() {
        const { username } = this.props;

        if (username == undefined)
            return null

        if (username.indexOf("@guest.starterpack.com") > -1) {
            return <li className="nav-item">
                <NavContext.Consumer>
                    {({ onUpdate }: NavProps) => (
                        <Link className="nav-link userMenu user-icon" to="/signin" onClick={onUpdate}>
                            <FontAwesomeIcon size="1x" icon={faSignInAlt} /> Sign In</Link>)}
                </NavContext.Consumer>
            </li>
        } else {
            return null
        }
    }
}
export default SignIn;