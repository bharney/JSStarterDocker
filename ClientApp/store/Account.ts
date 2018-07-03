import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { Bearer, ErrorMessage, ForgotPasswordViewModel, LoginViewModel, RegisterViewModel } from '../models';
import * as cookie from 'react-cookie';

const cookieKey = 'PCHUserGuid';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AccountState {
    username?: string;
    token?: Bearer;
    isRequiredToken: boolean;
    isRequiredRefreshOnClient?: boolean;
    isLoading: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestTokenAction {
    type: 'REQUEST_TOKEN';
    username: string;
}

interface ReceiveTokenAction {
    type: 'RECEIVE_TOKEN';
    username?: string;
    token?: Bearer;
}

interface LogoutAction {
    type: 'LOGOUT';
}

interface RequestVerificationAction {
    type: 'REQUEST_VERIFICATION';
    username: string;
}

interface ReceiveVerificationAction {
    type: 'RECEIVE_VERIFICATION';
    username?: ForgotPasswordViewModel;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RequestTokenAction | ReceiveTokenAction | RequestVerificationAction | ReceiveVerificationAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    login: (value: LoginViewModel, callback?: () => void, error?: (error: ErrorMessage) => void): AppThunkAction<KnownAction> => (dispatch) => {

        if (!value.rememberMe) {
            value.rememberMe = false;
        }
        let fetchTask = fetch("/Account/Login", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*"
            },
            credentials: "include",
            body: JSON.stringify(value)
        })
            .then(response => response.json() as Promise<Bearer | ErrorMessage>)
            .then(data => {
                if ((data as ErrorMessage).error) {
                    if (error) { error(data as ErrorMessage) }
                }
                else {
                    let token = data["token"];
                    let base64Url = token.split('.')[1];
                    let base64 = base64Url.replace('-', '+').replace('_', '/');
                    let decoded = JSON.parse(window.atob(base64));
                    let BearerToken: Bearer = {
                        access_token: token,
                        audience: decoded.aud,
                        expires: decoded.exp,
                        claims: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                        issuer: decoded.iss,
                        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"],
                        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                        userData: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/userData"],
                        jti: decoded.jti,
                        sub: decoded.sub
                    }

                    dispatch({ type: 'RECEIVE_TOKEN', username: value.email, token: BearerToken });
                    const cookieDataFromServer = window['cookieData'];
                    if (cookieDataFromServer) {
                        Object.getOwnPropertyNames(cookieDataFromServer).forEach(name => {
                            cookie.save(name, cookieDataFromServer[name]);
                        })
                    }


                    ///Todo Update SessionStorage
                    if (typeof window !== 'undefined') {
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem('username', value.email);
                            window.sessionStorage.setItem('jwt', JSON.stringify(BearerToken));
                        } else if (window.localStorage) {
                            window.localStorage.setItem('username', value.email);
                            window.localStorage.setItem('jwt', JSON.stringify(BearerToken));
                        }
                    }
                    if (callback) { callback(); }
                }
            })
            .catch(err => {
                let bearerFromStore: Bearer = {};
                let username: string = '';
                if (typeof window !== 'undefined') {
                    if (window.sessionStorage) {
                        username = window.sessionStorage.username;
                        bearerFromStore = JSON.parse(window.sessionStorage.jwt || "{}");
                    } else if (window.localStorage) {
                        username = window.localStorage.username;
                        bearerFromStore = JSON.parse(window.localStorage.jwt || "{}");
                    }
                }
                const token = bearerFromStore.access_token ? bearerFromStore : undefined
                dispatch({ type: 'RECEIVE_TOKEN', token: token });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TOKEN', username: value.email });
    },
    logout: (callback?: () => void): AppThunkAction<LogoutAction> => (dispatch, getState) => {
        let token = getState().session.token;
        let fetchTask: Promise<any>;
        if (token) {
            fetchTask = fetch("/Account/Logout", {
                method: "post",
                headers: {
                    "Authorization": `Bearer ${token.access_token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/plain, */*"
                },
                credentials: "include",
            })
                .then(() => {
                    if (typeof window !== 'undefined') {
                        if (window.sessionStorage) {
                            window.sessionStorage.removeItem('username');
                            window.sessionStorage.removeItem('jwt');
                        } else if (window.localStorage) {
                            window.localStorage.removeItem('username');
                            window.localStorage.removeItem('jwt');
                        }
                    }

                    dispatch({ type: 'LOGOUT' });
                    if (callback) { callback(); }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'LOGOUT' });
    },
    register: (value: RegisterViewModel, callback?: () => void, error?: (error: ErrorMessage) => void): AppThunkAction<KnownAction> => (dispatch) => {
        let fetchTask = fetch("/Account/Register", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*"
            },
            credentials: "include",
            body: JSON.stringify(value)
        })
            .then(response => response.json() as Promise<Bearer | ErrorMessage>)
            .then(data => {
                if ((data as ErrorMessage).error) {
                    if (error) { error(data as ErrorMessage) }
                }
                else {
                    let token = data["token"];
                    let base64Url = token.split('.')[1];
                    let base64 = base64Url.replace('-', '+').replace('_', '/');
                    let decoded = JSON.parse(window.atob(base64));
                    let BearerToken: Bearer = {
                        access_token: token,
                        audience: decoded.aud,
                        expires: decoded.exp,
                        claims: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                        issuer: decoded.iss,
                        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"],
                        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                        userData: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/userData"],
                        jti: decoded.jti,
                        sub: decoded.sub
                    }

                    dispatch({ type: 'RECEIVE_TOKEN', username: value.email, token: BearerToken });
                    const cookieDataFromServer = window['cookieData'];
                    if (cookieDataFromServer) {
                        Object.getOwnPropertyNames(cookieDataFromServer).forEach(name => {
                            cookie.save(name, cookieDataFromServer[name]);
                        })
                    }


                    ///Todo Update SessionStorage
                    if (typeof window !== 'undefined') {
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem('username', value.email);
                            window.sessionStorage.setItem('jwt', JSON.stringify(BearerToken));
                        } else if (window.localStorage) {
                            window.localStorage.setItem('username', value.email);
                            window.localStorage.setItem('jwt', JSON.stringify(BearerToken));
                        }
                    }
                    if (callback) { callback(); }
                }
            })
            .catch(() => {
                let bearerFromStore: Bearer = {};
                let username: string = '';
                if (typeof window !== 'undefined') {
                    if (window.sessionStorage) {
                        username = window.sessionStorage.username;
                        bearerFromStore = JSON.parse(window.sessionStorage.jwt || "{}");
                    } else if (window.localStorage) {
                        username = window.localStorage.username;
                        bearerFromStore = JSON.parse(window.localStorage.jwt || "{}");
                    }
                }
                const token = bearerFromStore.access_token ? bearerFromStore : undefined
                dispatch({ type: 'RECEIVE_TOKEN', token: token });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TOKEN', username: value.email });
    },
    forgotPassword: (username: string): AppThunkAction<KnownAction> => (dispatch) => {
        const model = {
            Email: username,
        };
        let fetchTask = fetch("/Account/ForgotPassword", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*"
            },
            body: JSON.stringify(model)
        })
            .then(response => response.json() as Promise<ForgotPasswordViewModel | ErrorMessage>)
            .then(data => {
                if ((data as ErrorMessage).error) {
                    dispatch({ type: 'RECEIVE_VERIFICATION', username: undefined });
                }
                else {
                    dispatch({ type: 'RECEIVE_VERIFICATION', username: username as ForgotPasswordViewModel });
                }
            })
            .catch(() => {
                dispatch({ type: 'REQUEST_VERIFICATION', username: undefined });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_VERIFICATION', username: username });
    },
    resetPassword: (username: string, password: string, userId: string, code: string): AppThunkAction<KnownAction> => (dispatch) => {
        const model = {
            Email: username,
            Password: password,
            ConfirmPassword: password,
            UserId: userId,
            Code: code
        };
        let fetchTask = fetch("/Account/ResetPassword", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*"
            },
            body: JSON.stringify(model)
        })
            .then(response => response.json() as Promise<Bearer | ErrorMessage>)
            .then(data => {
                if ((data as ErrorMessage).error) {
                    dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
                }
                else {
                    dispatch({ type: 'RECEIVE_TOKEN', username: username, token: data as Bearer });
                    ///Todo Update SessionStorage
                    if (typeof window !== 'undefined') {
                        if (window.sessionStorage) {
                            window.sessionStorage.setItem('username', username);
                            window.sessionStorage.setItem('jwt', JSON.stringify(data));
                        } else if (window.localStorage) {
                            window.localStorage.setItem('username', username);
                            window.localStorage.setItem('jwt', JSON.stringify(data));
                        }
                    }
                }
            })
            .catch(() => {
                let bearerFromStore: Bearer = {};
                let username: string = '';
                if (typeof window !== 'undefined') {
                    if (window.sessionStorage) {
                        username = window.sessionStorage.username;
                        bearerFromStore = JSON.parse(window.sessionStorage.jwt || "{}");
                    } else if (window.localStorage) {
                        username = window.localStorage.username;
                        bearerFromStore = JSON.parse(window.localStorage.jwt || "{}");
                    }
                }
                const token = bearerFromStore.access_token ? bearerFromStore : undefined
                dispatch({ type: 'RECEIVE_TOKEN', token: token });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TOKEN', username: username });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

///Todo Update SessionStorage
let bearerFromStore: Bearer = {};
let username: string = '';
if (typeof window !== 'undefined') {
    if (window.sessionStorage) {
        username = window.sessionStorage.username;
        bearerFromStore = JSON.parse(window.sessionStorage.jwt || "{}");
    } else if (window.localStorage) {
        username = window.localStorage.username;
        bearerFromStore = JSON.parse(window.localStorage.jwt || "{}");
    }
}

const unloadedState: AccountState = { token: bearerFromStore.issuer ? bearerFromStore : undefined, isRequiredToken: false, username: username, isRequiredRefreshOnClient: false, isLoading: false };

export const reducer: Reducer<AccountState> = (state: AccountState, incomingAction: Action) => {
    const action = incomingAction as KnownAction | LogoutAction;
    switch (action.type) {
        case 'REQUEST_TOKEN':
            return {
                username: action.username,
                token: state.token,
                isRequiredToken: state.isRequiredToken,
                isRequiredRefreshOnClient: false,
                isLoading: true
            };
        case 'RECEIVE_TOKEN':
            return {
                token: action.token,
                username: action.username,
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'LOGOUT':
            return {
                isRequiredToken: true,
                isRequiredRefreshOnClient: true,
                isLoading: false
            };
        case 'REQUEST_VERIFICATION':
            return {
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'RECEIVE_VERIFICATION':
            return {
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};