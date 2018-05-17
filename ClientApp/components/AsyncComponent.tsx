import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router';
import Loadable from 'react-loadable';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const loading = () => {
    return <div><FontAwesomeIcon icon="spinner" spin /></div>
};

const asyncComponent = child => Loadable({
    loading: loading,
    delay: 450,
    ...child
});

export default asyncComponent;
