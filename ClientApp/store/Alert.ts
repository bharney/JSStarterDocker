import { Action, Reducer } from 'redux';
import { Alert, AlertType, AnimationState } from '../models';
import { AppThunkAction } from './';

export interface AlertState {
    items: Alert[];
}
let internalIndex = 0;
const enteringDuration = 100;
const exitingDuration = 100;
const existedDuration = 100;
const autoCloseDuration = 5000;
const preventRepeat = true;

interface AlertAction {
    type: 'SEND_ALERT';
    id: number;
    message?: React.ReactNode | string;
    alertType: AlertType;
}

export interface CloseAlertAction {
    type: 'CLOSE_ALERT';
    id: number;
}

interface StartAnimateAction {
    type: 'START_ANIMATE';
    id: number;
    state: AnimationState;
}

type KnownAction = AlertAction | CloseAlertAction | StartAnimateAction;
export const actionCreators = {
    closeAlert: (index: number): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: 'START_ANIMATE', id: index, state: AnimationState.exiting });
        setTimeout(() => { dispatch({ type: 'START_ANIMATE', id: index, state: AnimationState.exited }); }, exitingDuration);
        setTimeout(() => { dispatch({ type: 'CLOSE_ALERT', id: index }); }, exitingDuration + existedDuration);
    },
    sendAlert: (message: React.ReactNode | string, alertType: AlertType, autoClose: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (getState().alert.items.length < 1 && preventRepeat) {
            dispatch({ type: 'SEND_ALERT', id: internalIndex, message, alertType });
            const currentIndex = internalIndex;
            setTimeout(() => { dispatch({ type: 'START_ANIMATE', id: currentIndex, state: AnimationState.entered }); }, enteringDuration);
            if (autoClose) {
                setTimeout(() => {
                    dispatch({ type: 'START_ANIMATE', id: currentIndex, state: AnimationState.exiting });
                }, autoCloseDuration);
                setTimeout(() => {
                    dispatch({ type: 'START_ANIMATE', id: currentIndex, state: AnimationState.exited });
                }, autoCloseDuration + exitingDuration);
                setTimeout(() => {
                    dispatch({ type: 'CLOSE_ALERT', id: currentIndex });
                }, autoCloseDuration + exitingDuration + existedDuration);
            }
            internalIndex++;
        }
    },
};

const unloadedState: AlertState = { items: [] };
export const reducer: Reducer<AlertState> = (state: AlertState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SEND_ALERT':
            return {
                items: [...state.items, {
                    alertType: action.alertType,
                    id: action.id,
                    message: action.message,
                    state: AnimationState.entering,
                }],
            };
        case 'START_ANIMATE':
            return {
                items: state.items.map((item) => { if (item.id === action.id) { item.state = action.state; } return item; }),
            };
        case 'CLOSE_ALERT':
            return {
                items: state.items.filter((value) => value.id !== action.id),
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};