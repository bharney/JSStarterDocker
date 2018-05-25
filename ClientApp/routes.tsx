import * as React from 'react';
import { Layout } from './components/Layout';
import { Switch } from 'react-router-dom';
import AppRoute from './components/AppRoute';
import asyncRoute from './components/AsyncRoute';
import asyncComponent from './components/asyncComponent';
const AsyncAppRoute = asyncComponent({ loader: () => import(/* webpackChunkName: "AppRoute" */'./components/AppRoute') })
const AsyncHome = asyncRoute({ loader: () => import(/* webpackChunkName: "Home" */'./components/Home') })
import Home from './components/Home';
const AsyncCounter = asyncRoute({ loader: () => import(/* webpackChunkName: "Counter" */'./components/Counter') })
const AsyncFetchData = asyncRoute({ loader: () => import(/* webpackChunkName: "FetchData" */'./components/FetchData') })

export const routes = <div>
    <Switch>
        <AppRoute exact path='/' component={Home} layout={Layout} />
        <AsyncAppRoute path='/counter' component={ AsyncCounter} layout={Layout} />
        <AsyncAppRoute path='/fetchdata/:startDateIndex?' component={ AsyncFetchData } layout={Layout} />
    </Switch>
</div>;
