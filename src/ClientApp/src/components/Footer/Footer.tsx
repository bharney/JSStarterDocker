import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';


export default class Footer extends React.Component<{}, {}> {
    public render() {
        return <footer className="container text-center">
                    <hr />
                    <div className="row">
                        <div className="col">
                    <p><strong>Made with <FontAwesomeIcon className="svg-inline--fa fa-w-16 fa-lg" icon={faHeart} size="1x" /> by Brian Harney</strong></p>
                        </div>
                    </div>
                </footer>;
    }
}
