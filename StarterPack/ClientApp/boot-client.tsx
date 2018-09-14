import { createBrowserHistory } from 'history';
import * as React from 'react';
import cookie from 'react-cookie';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from './configureStore';
import * as RoutesModule from './routes';
import { ApplicationState } from './store';
import * as SessionState from './store/Session';
import './styles/styles.scss';
let routes = RoutesModule.routes;

// Create browser history to use in the Redux store
const history = createBrowserHistory();

const cookieDataFromServer = window['cookieData'];
if (cookieDataFromServer) {
    Object.getOwnPropertyNames(cookieDataFromServer).forEach(name => {
        cookie.save(name, cookieDataFromServer[name]);
    })
}
// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);
store.dispatch(SessionState.actionCreators.getToken());

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    Loadable.preloadReady().then(() => {
        ReactDOM.hydrate(
            <AppContainer>
                <Provider store={store}>
                    <ConnectedRouter history={history} children={routes} />
                </Provider>
            </AppContainer>,
            document.getElementById('react-app')
        );
    });
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
