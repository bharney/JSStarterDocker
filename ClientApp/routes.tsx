import * as React from 'react';
import { Layout } from './components/Layout';
import { Switch } from 'react-router-dom';
import AppRoute from './components/AppRoute';
import asyncRoute from './components/AsyncRoute';
const AsyncHome = asyncRoute({ loader: () => import(/* webpackChunkName: "Home" */'./components/Home') })
const AsyncCounter = asyncRoute({ loader: () => import(/* webpackChunkName: "Counter" */'./components/Counter') })
const AsyncFetchData = asyncRoute({ loader: () => import(/* webpackChunkName: "FetchData" */'./components/FetchData') })

export const routes = <div>
    <Switch>
        <AppRoute exact path='/' component={AsyncHome} layout={Layout} />
        <AppRoute path='/counter' component={ AsyncCounter} layout={Layout} />
        <AppRoute path='/fetchdata/:startDateIndex?' component={ AsyncFetchData } layout={Layout} />
    </Switch>
</div>;
