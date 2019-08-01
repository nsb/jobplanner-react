// @flow
import type {Store as ReduxStore, Dispatch as ReduxDispatch} from 'redux';
import type {Action} from './Action';
import type {State} from './State';
export type Store = ReduxStore<State, Action>;
// export type Dispatch = ReduxDispatch<Action> & Thunk<Action>;
// export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => Promise<any>;
export type PromiseAction = Promise<Action>;
