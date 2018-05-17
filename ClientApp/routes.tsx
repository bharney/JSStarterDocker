import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import { Switch } from 'react-router-dom';
import AppRoute from './components/AppRoute';

export const routes = <div>
    <Switch>
        <AppRoute exact path='/' component={Home} layout={Layout} />
        <AppRoute path='/counter' component={ Counter} layout={Layout} />
        <AppRoute path='/fetchdata/:startDateIndex?' component={ FetchData } layout={Layout} />
    </Switch>
</div>;
