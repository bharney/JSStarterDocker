import * as React from 'react';
import Loadable from 'react-loadable';
import { Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import App from './App';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const loading = () => {
    return <div><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>
};

const AsyncHome = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */'./components/Home'),
    modules: ['./components/Home'],
    webpack: () => [require.resolveWeak('./components/Home')],
    loading: loading,
});


const AsyncCounter = Loadable({
    loader: () => import(/* webpackChunkName: "Counter" */'./components/Counter'),
    modules: ['./components/Counter'],
    webpack: () => [require.resolveWeak('./components/Counter')],
    loading: loading,
});


const AsyncFetchData = Loadable({
    loader: () => import(/* webpackChunkName: "FetchData" */'./components/FetchData'),
    modules: ['./components/FetchData'],
    webpack: () => [require.resolveWeak('./components/FetchData')],
    loading: loading,
});

const AsyncLayout = Loadable({
    loader: () => import(/* webpackChunkName: "Layout" */'./components/Layout'),
    modules: ['./components/Layout'],
    webpack: () => [require.resolveWeak('./components/Layout')],
    loading: loading,
});

const AsyncNotFound = Loadable({
    loader: () => import(/* webpackChunkName: "NotFound" */'./components/NotFound'),
    modules: ['./components/NotFound'],
    webpack: () => [require.resolveWeak('./components/NotFound')],
    loading: loading,
});

export const routes = <div>
    <Switch>
        <App exact path='/' component={AsyncHome} layout={AsyncLayout} />
        <App path='/counter' component={AsyncCounter} layout={AsyncLayout} />
        <App path='/fetchdata/:startDateIndex?' component={AsyncFetchData} layout={AsyncLayout} />
        <App component={AsyncNotFound} layout={AsyncLayout} />
    </Switch>
</div>;
