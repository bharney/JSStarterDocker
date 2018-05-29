import * as React from 'react';
import { Layout } from './components/Layout';
import { Switch } from 'react-router-dom';
import AppRoute from './components/AppRoute';
import asyncRoute from './components/AsyncRoute';
import asyncComponent from './components/asyncComponent';
const AsyncAppRoute = asyncComponent({ loader: () => import(/* webpackChunkName: "AppRoute" */'./components/AppRoute') })
const AsyncHome = asyncRoute({ loader: () => import(/* webpackChunkName: "Home" */'./components/Home') })
const AsyncLayout = asyncComponent({ loader: () => import(/* webpackChunkName: "Layout" */'./components/Layout')});
const AsyncCounter = asyncRoute({ loader: () => import(/* webpackChunkName: "Counter" */'./components/Counter') })
const AsyncFetchData = asyncRoute({ loader: () => import(/* webpackChunkName: "FetchData" */'./components/FetchData') })

export const routes = <div>
    <Switch>
        <AppRoute exact path='/' component={AsyncHome} layout={AsyncLayout} />
        <AppRoute path='/counter' component={AsyncCounter} layout={AsyncLayout} />
        <AppRoute path='/fetchdata/:startDateIndex?' component={AsyncFetchData} layout={AsyncLayout} />
    </Switch>
</div>;
