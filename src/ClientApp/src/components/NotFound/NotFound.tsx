import { faBomb } from '@fortawesome/free-solid-svg-icons/faBomb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

export class NotFound extends React.Component<{}, {}> {
    public render() {
        return <section className="pt-5 container">
            <div className="row justify-content-center pt-4">
                <div className="col-12 col-sm-8 col-lg-7 text-center">
                    <h2 className="display-4">Page Not Found.</h2>
                    <p className="pt-3 pb-3 lead">Ops. Sorry, something must have gone wrong, or we could not find the page you were looking for.</p>
                    <FontAwesomeIcon className="mt-3 mb-3" icon={faBomb} size="3x" />
                </div>
            </div>
        </section>;
    }
}
export default NotFound;