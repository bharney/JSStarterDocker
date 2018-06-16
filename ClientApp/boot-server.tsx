import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString, renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { routes } from './routes';
import configureStore from './configureStore';
<<<<<<< Updated upstream
import { getBundles } from '@7rulnik/react-loadable/webpack'
import Loadable from '@7rulnik/react-loadable';
=======
import { getBundles } from 'react-loadable/webpack'
import Loadable from 'react-loadable';
import App from './App';
import { routes } from './routes';
>>>>>>> Stashed changes
const stats = require('./dist/react-loadable.json');

export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {
        let modules = [];
        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        const store = configureStore(createMemoryHistory());
        store.dispatch(replace(params.location));

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
        const app = (
            <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                <Provider store={ store }>
                    <StaticRouter context={ routerContext } location={ params.location.path } children={ routes } />
                </Provider>
            </Loadable.Capture>
        );
        renderToNodeStream(app);
        let bundles = getBundles(stats, modules);
        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }
        
        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { initialReduxState: store.getState() }
            });
        }, reject); // Also propagate any errors back into the host application
    });
});
