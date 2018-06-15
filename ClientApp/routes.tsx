import * as React from 'react';
import { actionCreators } from './store/WeatherForecasts';
import Loadable from '@7rulnik/react-loadable';
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

const routes = [
    {
        path: '/',
        exact: true,
        component: AsyncHome,
    },
    {
        path: '/counter',
        exact: false,
        component: AsyncCounter,
    },
    {
        path: '/fetchdata/:startDateIndex?',
        component: AsyncFetchData,
        exact: false,
        fetchInitialData: (path = '') => actionCreators.requestWeatherForecasts(0)
    }
]

export default routes