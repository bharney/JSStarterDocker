import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import { Bearer, ErrorMessage } from '../models';
import * as cookie from 'react-cookie';

const cookieKey = 'PCHUserGuid';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface SessionState {
    username?: string;
    token?: Bearer;
    isRequiredToken: boolean;
    isRequiredRefreshOnClient?: boolean;
    isLoading: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequiredTokenAction {
    type: 'REQUIRED_TOKEN'
}

interface ReceiveTokenAction {
    type: 'RECEIVE_TOKEN';
    username?: string;
    token?: Bearer;
}

interface CancelRequiredTokenAction {
    type: 'CANCEL_REQUIRED_TOKEN'
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RequiredTokenAction | ReceiveTokenAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    requiredToken: (): AppThunkAction<RequiredTokenAction> => (dispatch) => {
        dispatch({ type: 'REQUIRED_TOKEN' });
    },
    cancelRequiredToken: (): AppThunkAction<CancelRequiredTokenAction> => (dispatch) => {
        dispatch({ type: 'CANCEL_REQUIRED_TOKEN' });
    },
    loadToken: (callback?: () => void): AppThunkAction<{}> => (dispatch, getState) => {
        let bearerFromStore: Bearer | undefined = {};
        let username: string | undefined = '';

        if (typeof window !== 'undefined') {
            if (window.sessionStorage) {
                username = window.sessionStorage.username;
                bearerFromStore = window.sessionStorage.jwt !== undefined ? JSON.parse(window.sessionStorage.jwt) : undefined;
            } else if (window.localStorage) {
                username = window.localStorage.username;
                bearerFromStore = window.localStorage.jwt !== undefined ? JSON.parse(window.localStorage.jwt) : undefined;
            }
        }
        if (bearerFromStore !== getState().session.token) {
            if (bearerFromStore !== undefined && username !== undefined) {
                dispatch({ type: 'RECEIVE_TOKEN', username: username, token: bearerFromStore });
                if (callback) callback();

            } else if (typeof window !== 'undefined') {
                dispatch({ type: 'CANCEL_REQUIRED_TOKEN' });
            }
        }
    },
    getToken: (callback?: () => void): AppThunkAction<{}> => (dispatch) => {
        let fetchTask = fetch("/Account/GetToken", {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*"
            },
            credentials: "include",
        })
            .then(response => response.json() as Promise<Bearer | ErrorMessage>)
            .then(data => {
                if ((data as ErrorMessage).error) {
                    dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
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
                    dispatch({ type: 'RECEIVE_TOKEN', username: BearerToken.name, token: BearerToken });
                    ///Todo Update SessionStorage
                    const cookieDataFromServer = window['cookieData'];
                    if (cookieDataFromServer) {
                        Object.getOwnPropertyNames(cookieDataFromServer).forEach(name => {
                            cookie.save(name, cookieDataFromServer[name]);
                        })
                    }

                    if (typeof window !== 'undefined') {

                        if (window.sessionStorage) {
                            window.sessionStorage.setItem('username', BearerToken.name);
                            window.sessionStorage.setItem('jwt', JSON.stringify(BearerToken));
                        } else if (window.localStorage) {
                            window.localStorage.setItem('username', BearerToken.name);
                            window.localStorage.setItem('jwt', JSON.stringify(BearerToken));
                        }
                    }
                    if (callback) { callback(); }
                }
            })
            .catch(err => {
                dispatch({ type: 'RECEIVE_TOKEN', token: undefined });
            });
        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_TOKEN' });
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

const unloadedState: SessionState = { token: bearerFromStore.access_token ? bearerFromStore : undefined, isRequiredToken: false, username: username, isRequiredRefreshOnClient: false, isLoading: false };

export const reducer: Reducer<SessionState> = (state: SessionState, incomingAction: Action) => {
    const action = incomingAction as KnownAction | CancelRequiredTokenAction;
    switch (action.type) {
        case 'REQUIRED_TOKEN':
            return {
                isRequiredToken: true,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'RECEIVE_TOKEN':
            return {
                token: action.token,
                username: action.username,
                isRequiredToken: false,
                isRequiredRefreshOnClient: false,
                isLoading: false
            };
        case 'CANCEL_REQUIRED_TOKEN':
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