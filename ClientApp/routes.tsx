import * as React from 'react';
import Loadable from 'react-loadable';
import { Switch } from 'react-router-dom';
import App from './App';
import * as RequiredAuthentication from './components/Account/RequiredAuthentication';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const loading = () => {
    return <div><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>
};

const AsyncHome = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */'./components/Home/Home'),
    modules: ['./components/Home/Home'],
    webpack: () => [require.resolveWeak('./components/Home/Home')],
    loading: loading,
});
const AsyncCounter = Loadable({
    loader: () => import(/* webpackChunkName: "Counter" */'./components/Counter/Counter'),
    modules: ['./components/Counter/Counter'],
    webpack: () => [require.resolveWeak('./components/Counter/Counter')],
    loading: loading,
});
const AsyncFetchData = Loadable({
    loader: () => import(/* webpackChunkName: "FetchData" */'./components/WeatherForecast/FetchData'),
    modules: ['./components/WeatherForecast/FetchData'],
    webpack: () => [require.resolveWeak('./components/WeatherForecast/FetchData')],
    loading: loading,
});
const AsyncLayout = Loadable({
    loader: () => import(/* webpackChunkName: "Layout" */'./components/Layout/Layout'),
    modules: ['./components/Layout/Layout'],
    webpack: () => [require.resolveWeak('./components/Layout/Layout')],
    loading: loading,
});
const AsyncNotFound = Loadable({
    loader: () => import(/* webpackChunkName: "NotFound" */'./components/NotFound/NotFound'),
    modules: ['./components/NotFound/NotFound'],
    webpack: () => [require.resolveWeak('./components/NotFound/NotFound')],
    loading: loading,
});
const AsyncProfile = Loadable({
    loader: () => import(/* webpackChunkName: "Profile" */'./components/Profile/Profile'),
    modules: ['./components/Profile/Profile'],
    webpack: () => [require.resolveWeak('./components/Profile/Profile')],
    loading: loading,
})
const AsyncRegister = Loadable({
    loader: () => import(/* webpackChunkName: "Register" */'./components/Account/Register'),
    modules: ['./components/Account/Register'],
    webpack: () => [require.resolveWeak('./components/Account/Register')],
    loading: loading,
})
const AsyncSignIn = Loadable({
    loader: () => import(/* webpackChunkName: "SignIn" */'./components/Account/SignIn'),
    modules: ['./components/Account/SignIn'],
    webpack: () => [require.resolveWeak('./components/Account/SignIn')],
    loading: loading,
})
const AsyncForgotPassword = Loadable({
    loader: () => import(/* webpackChunkName: "ForgotPassword" */'./components/Account/ForgotPassword'),
    modules: ['./components/Account/ForgotPassword'],
    webpack: () => [require.resolveWeak('./components/Account/ForgotPassword')],
    loading: loading,
})
const AsyncForgotPasswordConfirmation = Loadable({
    loader: () => import(/* webpackChunkName: "ForgotPasswordConfirmation" */'./components/Account/ForgotPasswordConfirmation'),
    modules: ['./components/Account/ForgotPasswordConfirmation'],
    webpack: () => [require.resolveWeak('./components/Account/ForgotPasswordConfirmation')],
    loading: loading,
})
const AsyncResetPassword = Loadable({
    loader: () => import(/* webpackChunkName: "ResetPassword" */'./components/Account/ResetPassword'),
    modules: ['./components/Account/ResetPassword'],
    webpack: () => [require.resolveWeak('./components/Account/ResetPassword')],
    loading: loading,
})
const AsyncResetPasswordConfirmation = Loadable({
    loader: () => import(/* webpackChunkName: "ResetPasswordConfirmation" */'./components/Account/ResetPasswordConfirmation'),
    modules: ['./components/Account/ResetPasswordConfirmation'],
    webpack: () => [require.resolveWeak('./components/Account/ResetPasswordConfirmation')],
    loading: loading,
})
const AsyncSignedOut = Loadable({
    loader: () => import(/* webpackChunkName: "SignedOut" */'./components/Account/SignedOut'),
    modules: ['./components/Account/SignedOut'],
    webpack: () => [require.resolveWeak('./components/Account/SignedOut')],
    loading: loading,
})

export const routes = <div>
    <Switch>
        <App exact path='/' component={AsyncHome} layout={AsyncLayout} />
        <App path='/counter' component={AsyncCounter} layout={AsyncLayout} />
        <App path='/fetchdata/:startDateIndex?' component={AsyncFetchData} layout={AsyncLayout} />
        <App path='/Signin' component={AsyncSignIn} layout={AsyncLayout} />
        <App path='/Register' component={AsyncRegister} layout={AsyncLayout} />
        <App path='/ForgotPassword' component={AsyncForgotPassword} layout={AsyncLayout} />
        <App path='/ForgotPasswordConfirmation' component={AsyncForgotPasswordConfirmation} layout={AsyncLayout} />
        <App path='/Account/ResetPassword/:userId?/:code?' component={AsyncResetPassword} layout={AsyncLayout} />
        <App path='/ResetPasswordConfirmation' component={AsyncResetPasswordConfirmation} layout={AsyncLayout} />
        <App path='/SignedOut' component={AsyncSignedOut} layout={AsyncLayout} />
        <App path='/Profile' component={RequiredAuthentication.requireAuthentication(AsyncProfile)} layout={AsyncLayout} />
        <App component={AsyncNotFound} layout={AsyncLayout} />
    </Switch>
</div>;