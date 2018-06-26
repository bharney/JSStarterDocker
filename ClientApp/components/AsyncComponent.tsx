import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router';
import Loadable from 'react-loadable';

const loading = () => {
    return <div></div>
};

const asyncComponent = child => Loadable({
    loading: loading,
    delay: 450,
    ...child
});

export default asyncComponent;
