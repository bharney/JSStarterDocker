import * as cookie from 'react-cookie';
import { Bearer, ErrorMessage } from '../models';


function unloadedTokenState() {
    let bearerFromStore: Bearer = {};
    if (typeof window !== 'undefined') {
        if (window.sessionStorage) {
            bearerFromStore = JSON.parse((<any>window).sessionStorage.jwt || "{}");
        } else if (window.localStorage) {
            bearerFromStore = JSON.parse((<any>window).localStorage.jwt || "{}");
        }
    }
    return bearerFromStore;
}

function removeToken() {
    if (typeof window !== 'undefined') {
        if (window.sessionStorage) {
            window.sessionStorage.removeItem('username');
            window.sessionStorage.removeItem('jwt');
        }
        else if (window.localStorage) {
            window.localStorage.removeItem('username');
            window.localStorage.removeItem('jwt');
        }
    }
}

function saveToken(BearerToken: Bearer) {
    if (typeof window !== 'undefined') {
        const cookieDataFromServer = window['cookieData'];
        if (cookieDataFromServer) {
            Object.getOwnPropertyNames(cookieDataFromServer).forEach(name => {
                cookie.save(name, cookieDataFromServer[name]);
            })
        }
        if (window.sessionStorage) {
            window.sessionStorage.setItem('username', BearerToken.name);
            window.sessionStorage.setItem('jwt', JSON.stringify(BearerToken));
        }
        else if (window.localStorage) {
            window.localStorage.setItem('username', BearerToken.name);
            window.localStorage.setItem('jwt', JSON.stringify(BearerToken));
        }
    }
}

function decodeToken(data: Bearer | ErrorMessage) {
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
    };
    return BearerToken;
}


export { unloadedTokenState, removeToken, saveToken, decodeToken };
 