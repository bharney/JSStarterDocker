import { reducer as formReducer } from 'redux-form';
import * as Account from './Account';
import * as Alert from './Alert';
import * as Counter from './Counter';
import * as Profile from './Profile';
import * as Session from './Session';
import * as WeatherForecasts from './WeatherForecasts';

// The top-level state object
export interface ApplicationState {
    session: Session.SessionState;
    alert: Alert.AlertState;
    account: Account.AccountState;
    profile: Profile.ProfileState;
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
}
// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    session: Session.reducer,
    alert: Alert.reducer,
    account: Account.reducer,
    form: formReducer,
    profile: Profile.reducer,
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
