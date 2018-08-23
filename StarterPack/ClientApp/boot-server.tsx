import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import configureStore from './configureStore';
import { getBundles } from 'react-loadable/webpack'
import Loadable from 'react-loadable';
import App from './App';
import { routes } from './routes';
const stats = require('./dist/react-loadable.json');
import cookieUtil from 'cookie';
import cookie from 'react-cookie';

function plugInCookiesFromDotNet(cookieData: { key: string, value: string }[], res) {
    const formattedData = {};
    cookieData.forEach(keyValuePair => {
        formattedData[keyValuePair.key] = keyValuePair.value;
    });
    cookie.plugToRequest({ cookies: formattedData }, res);
}

export default createServerRenderer(params => {
    return Loadable.preloadAll().then(() => {
        return new Promise<RenderResult>((resolve, reject) => {
            const cookiesModifiedOnServer = {};
            if (params.data.cookies) {
                plugInCookiesFromDotNet(params.data.cookies, {
                    cookie: (name, val) => { cookiesModifiedOnServer[name] = val; }
                })
            }
            var serverParams = JSON.parse(params.data);
            let criticalStyles = "";
            let criticalScripts = "";
            let mainStyles = "";
            let mainScripts = "";
            let vendorScripts = "";
            let vendorStyles = "";
            if (serverParams.Styles) {
                let files = serverParams.Styles;
                criticalStyles = files.filter(bundle => bundle.includes('critical.css')).map(style => {
                    return `<link href="${style}" rel="stylesheet"/>`
                }).join('\n')
                vendorStyles = files.filter(bundle => bundle.includes('vendor.css')).map(style => {
                    return `<link href="${style}" rel="stylesheet"/>`
                }).join('\n')
                mainStyles = files.filter(bundle => bundle.includes('bundle.css')).map(style => {
                    return `<link href="${style}" rel="stylesheet"/>`
                }).join('\n')
            }
            if (serverParams.Scripts) {
                let files = serverParams.Scripts;
                criticalScripts = files.filter(bundle => bundle.includes('critical.js')).map(script => {
                    return `<script charset="utf-8" src="${script}"></script>`
                }).join('\n')
                vendorScripts = files.filter(bundle => bundle.includes('vendor.js')).map(script => {
                    return `<script charset="utf-8" src="${script}"></script>`
                }).join('\n')
                mainScripts = files.filter(bundle => bundle.includes('bundle.js')).map(script => {
                    return `<script charset="utf-8" src="${script}"></script>`
                }).join('\n')
            }

            let modules = [];
            // Prepare Redux store with in-memory history, and dispatch a navigation event
            // corresponding to the incoming URL
            const store = configureStore(createMemoryHistory());
            store.dispatch(replace(params.location));

            // Prepare an instance of the application and perform an inital render that will
            // cause any async tasks (e.g., data access) to begin
            const routerContext: any = {};

            const app = renderToString(
                <Loadable.Capture report={moduleName => { modules.push(moduleName) }}>
                    <Provider store={store}>
                        <StaticRouter context={routerContext} location={params.location.path} children={routes} />
                    </Provider>
                </Loadable.Capture>
            );

            
            let bundles = getBundles(stats, modules);
            let styles = bundles.filter(bundle => bundle.file.endsWith('.css'));
            let scripts = bundles.filter(bundle => bundle.file.endsWith('.js'));
            const html = `<html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content="Starter Pack for React with ASP.NET Core" />
                    <title>Starter Pack</title>
                    ${criticalStyles} 
                    ${vendorStyles} 
                    ${styles.map(style => `<link href="/dist/${style.file}" rel="stylesheet"/>`).join('\n')}
                </head>
                <body>
                    <div id="react-app">${app}</div>
                    ${criticalScripts}
                    ${mainStyles} 
                    ${vendorScripts}
                    ${scripts.map(script => `<script charset="utf-8" src="/dist/${script.file}"></script>`).join('\n')}
                    ${mainScripts}
                </body>
            </html>`

            // If there's a redirection, just send this information back to the host application
            if (routerContext.url) {
                resolve({ redirectUrl: routerContext.url });
                return;
            }

            // Once any async tasks are done, we can perform the final render
            // We also send the redux store state, so the client can continue execution where the server left off
            params.domainTasks.then(() => {
                resolve({
                    html: html,
                    globals: {
                        initialReduxState: store.getState(),
                        cookieData: cookiesModifiedOnServer
                    }
                });
            }, reject)
        });
    }); // Also propagate any errors back into the host application
});
