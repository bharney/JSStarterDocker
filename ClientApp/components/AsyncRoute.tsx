import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router';
import Loadable from '@7rulnik/react-loadable';

import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const loading = () => {
    return <div><FontAwesomeIcon style={{ position: "absolute", top: "9vh", left: "50%", fontSize: "45px" }} icon={faSpinner} spin /></div>
};

const asyncRoute = child => Loadable({
    loading: loading,
    delay: 450,
    ...child
});

export default asyncRoute;
