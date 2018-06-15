import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import configureStore from './configureStore';
import { getBundles } from '@7rulnik/react-loadable/webpack'
import Loadable from '@7rulnik/react-loadable';
import App from './App';
import { routes } from './routes';
const stats = require('./dist/react-loadable.json');

export default createServerRenderer(params => {
    return Loadable.preloadAll().then(() => {
        return new Promise<RenderResult>((resolve, reject) => {
            var importFiles = JSON.parse(params.data);
            let criticalStyles = "";
            let criticalScripts = "";
            let mainStyles = "";
            let mainScripts = "";
            if (importFiles.Styles) {
                let files = importFiles.Styles;
                criticalStyles = files.filter(bundle => bundle.includes('critical')).map(style => {
                    return `<link href="${style}" rel="stylesheet"/>`
                }).join('\n')
                mainStyles = files.filter(bundle => bundle.includes('bundle')).map(style => {
                    return `<link href="${style}" rel="stylesheet"/>`
                }).join('\n')
            }
            if (importFiles.Scripts) {
                let files = importFiles.Scripts;
                criticalScripts = files.filter(bundle => bundle.includes('critical')).map(script => {
                    return `<script charset="utf-8" src="${script}"></script>`
                }).join('\n')
                mainScripts = files.map(script => {
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
                    <style>
                    html,body{overflow-x:hidden}body{padding-top:70px}#custom-nav{padding-top:1em;padding-bottom:1em;opacity:1;box-shadow:none;z-index:999;box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);-webkit-font-smoothing:antialiased}main{padding-top:3%}@@media screen and (max-width:767px){.row-offcanvas{position:relative}.row-offcanvas-right{right:0}.row-offcanvas-right .sidebar-offcanvas{right:-100%}.sidebar-offcanvas{position:absolute;top:0;width:50%}}
                    </style>
                    ${criticalStyles} 
                    ${styles.map(style => `<link href="/dist/${style.file}" rel="stylesheet"/>`).join('\n')}
                    ${scripts.map(script => `<script charset="utf-8" src="/dist/${script.file}"></script>`).join('\n')}
                </head>
                <body>
                    <div id="react-app">${app}</div>
                    ${criticalScripts}
                    ${mainStyles} 
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
                    globals: { initialReduxState: store.getState() }
                });
            }, reject)
        });
    }); // Also propagate any errors back into the host application
});
