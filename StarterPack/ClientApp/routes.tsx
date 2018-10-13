import * as React from "react";
import Loadable from "react-loadable";
import { Switch } from "react-router-dom";
import App from "./App";
import * as RequiredAuthentication from "./components/Account/RequiredAuthentication";

const loading = () => {
    return <div />;
};

const AsyncHome = Loadable({
    loader: () => import(/* webpackChunkName: "Home" */ "./components/Home/Home"),
    modules: ["./components/Home/Home"],
    webpack: () => [require.resolveWeak("./components/Home/Home")],
    loading: loading
});
const AsyncCounter = Loadable({
    loader: () =>
        import(/* webpackChunkName: "Counter" */ "./components/Counter/Counter"),
    modules: ["./components/Counter/Counter"],
    webpack: () => [require.resolveWeak("./components/Counter/Counter")],
    loading: loading
});
const AsyncFetchData = Loadable({
    loader: () =>
        import(/* webpackChunkName: "FetchData" */ "./components/WeatherForecast/FetchData"),
    modules: ["./components/WeatherForecast/FetchData"],
    webpack: () => [
        require.resolveWeak("./components/WeatherForecast/FetchData")
    ],
    loading: loading
});
const AsyncLayout = Loadable({
    loader: () =>
        import(/* webpackChunkName: "Layout" */ "./components/Layout/Layout"),
    modules: ["./components/Layout/Layout"],
    webpack: () => [require.resolveWeak("./components/Layout/Layout")],
    loading: loading
});
const AsyncHomeLayout = Loadable({
    loader: () =>
        import(/* webpackChunkName: "HomeLayout" */ "./components/Layout/HomeLayout"),
    modules: ["./components/Layout/HomeLayout"],
    webpack: () => [require.resolveWeak("./components/Layout/HomeLayout")],
    loading: loading
});
const AsyncNotFound = Loadable({
    loader: () =>
        import(/* webpackChunkName: "NotFound" */ "./components/NotFound/NotFound"),
    modules: ["./components/NotFound/NotFound"],
    webpack: () => [require.resolveWeak("./components/NotFound/NotFound")],
    loading: loading
});
const AsyncEditProfile = Loadable({
    loader: () =>
        import(/* webpackChunkName: "EditProfile" */ "./components/Profile/EditProfile"),
    modules: ["./components/Profile/EditProfile"],
    webpack: () => [require.resolveWeak("./components/Profile/EditProfile")],
    loading: loading
});
const AsyncRegister = Loadable({
    loader: () =>
        import(/* webpackChunkName: "Register" */ "./components/Account/Register"),
    modules: ["./components/Account/Register"],
    webpack: () => [require.resolveWeak("./components/Account/Register")],
    loading: loading
});
const AsyncSignIn = Loadable({
    loader: () =>
        import(/* webpackChunkName: "SignIn" */ "./components/Account/SignIn"),
    modules: ["./components/Account/SignIn"],
    webpack: () => [require.resolveWeak("./components/Account/SignIn")],
    loading: loading
});
const AsyncForgotPassword = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ForgotPassword" */ "./components/Account/ForgotPassword"),
    modules: ["./components/Account/ForgotPassword"],
    webpack: () => [require.resolveWeak("./components/Account/ForgotPassword")],
    loading: loading
});
const AsyncForgotPasswordConfirmation = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ForgotPasswordConfirmation" */ "./components/Account/ForgotPasswordConfirmation"),
    modules: ["./components/Account/ForgotPasswordConfirmation"],
    webpack: () => [
        require.resolveWeak("./components/Account/ForgotPasswordConfirmation")
    ],
    loading: loading
});
const AsyncResetPassword = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ResetPassword" */ "./components/Account/ResetPassword"),
    modules: ["./components/Account/ResetPassword"],
    webpack: () => [require.resolveWeak("./components/Account/ResetPassword")],
    loading: loading
});
const AsyncResetPasswordConfirmation = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ResetPasswordConfirmation" */ "./components/Account/ResetPasswordConfirmation"),
    modules: ["./components/Account/ResetPasswordConfirmation"],
    webpack: () => [
        require.resolveWeak("./components/Account/ResetPasswordConfirmation")
    ],
    loading: loading
});
const AsyncSignedOut = Loadable({
    loader: () =>
        import(/* webpackChunkName: "SignedOut" */ "./components/Account/SignedOut"),
    modules: ["./components/Account/SignedOut"],
    webpack: () => [require.resolveWeak("./components/Account/SignedOut")],
    loading: loading
});
const AsyncAccount = Loadable({
    loader: () =>
        import(/* webpackChunkName: "Account" */ "./components/Account/Account"),
    modules: ["./components/Account/Account"],
    webpack: () => [require.resolveWeak("./components/Account/Account")],
    loading: loading
});
const AsyncChangePassword = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ChangePassword" */ "./components/Account/ChangePassword"),
    modules: ["./components/Account/ChangePassword"],
    webpack: () => [require.resolveWeak("./components/Account/ChangePassword")],
    loading: loading
});
const AsyncDeleteAccount = Loadable({
    loader: () =>
        import(/* webpackChunkName: "DeleteAccount" */ "./components/Account/DeleteAccount"),
    modules: ["./components/Account/ChangePassword"],
    webpack: () => [require.resolveWeak("./components/Account/DeleteAccount")],
    loading: loading
});
const AsyncChangeEmail = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ChangeEmail" */ "./components/Account/ChangeEmail"),
    modules: ["./components/Account/ChangeEmail"],
    webpack: () => [require.resolveWeak("./components/Account/ChangeEmail")],
    loading: loading
});
const AsyncChangeEmailConfirmation = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ChangeEmailConfirmation" */ "./components/Account/ChangeEmailConfirmation"),
    modules: ["./components/Account/ChangeEmailConfirmation"],
    webpack: () => [
        require.resolveWeak("./components/Account/ChangeEmailConfirmation")
    ],
    loading: loading
});
const AsyncConfirmEmail = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ConfirmEmail" */ "./components/Account/ConfirmEmail"),
    modules: ["./components/Account/ConfirmEmail"],
    webpack: () => [
        require.resolveWeak("./components/Account/ConfirmEmail")
    ],
    loading: loading
});
const AsyncConfirmRegistrationEmail = Loadable({
    loader: () =>
        import(/* webpackChunkName: "ConfirmRegistrationEmail" */ "./components/Account/ConfirmRegistrationEmail"),
    modules: ["./components/Account/ConfirmRegistrationEmail"],
    webpack: () => [
        require.resolveWeak("./components/Account/ConfirmRegistrationEmail")
    ],
    loading: loading
});
const AsyncRegisterConfirmation = Loadable({
    loader: () =>
        import(/* webpackChunkName: "RegisterConfirmation" */ "./components/Account/RegisterConfirmation"),
    modules: ["./components/Account/RegisterConfirmation"],
    webpack: () => [
        require.resolveWeak("./components/Account/RegisterConfirmation")
    ],
    loading: loading
});
export const routes = (
    <div>
        <Switch>
            <App exact path="/" component={AsyncHome} layout={AsyncLayout} />
            <App path="/counter" component={AsyncCounter} layout={AsyncLayout} />
            <App
                path="/fetchdata/:startDateIndex?"
                component={AsyncFetchData}
                layout={AsyncLayout}
            />
            <App path="/Signin" component={AsyncSignIn} layout={AsyncHomeLayout} />
            <App
                path="/Register"
                component={AsyncRegister}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ForgotPassword"
                component={AsyncForgotPassword}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ForgotPasswordConfirmation"
                component={AsyncForgotPasswordConfirmation}
                layout={AsyncHomeLayout}
            />
            <App
                path="/RegistrationConfirmation"
                component={AsyncRegisterConfirmation}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ConfirmRegistrationEmail/:userId?/:code?"
                component={AsyncConfirmRegistrationEmail}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ConfirmEmail/:userId?/:code?"
                component={AsyncConfirmEmail}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/ResetPassword/:userId?/:code?"
                component={AsyncResetPassword}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ResetPasswordConfirmation"
                component={AsyncResetPasswordConfirmation}
                layout={AsyncHomeLayout}
            />
            <App
                path="/SignedOut"
                component={AsyncSignedOut}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Profile/Edit"
                component={RequiredAuthentication.requireAuthentication(
                    AsyncEditProfile
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Profile"
                component={RequiredAuthentication.requireAuthentication(AsyncAccount)}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/Delete"
                component={RequiredAuthentication.requireAuthentication(
                    AsyncDeleteAccount
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/ChangeEmail/Confirmation"
                component={RequiredAuthentication.requireAuthentication(
                    AsyncChangeEmailConfirmation
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/ChangeEmail"
                component={RequiredAuthentication.requireAuthentication(
                    AsyncChangeEmail
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account"
                component={RequiredAuthentication.requireAuthentication(AsyncAccount)}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ChangePassword"
                component={RequiredAuthentication.requireAuthentication(
                    AsyncChangePassword
                )}
                layout={AsyncHomeLayout}
            />
            <App component={AsyncNotFound} layout={AsyncHomeLayout} />
        </Switch>
    </div>
);
