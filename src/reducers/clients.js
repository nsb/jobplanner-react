// @flow
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/clients";

type IsFetchingState = boolean;
type ResultState = Array<number>;
export type State = {
  isFetching: IsFetchingState,
  result: ResultState
};

const isFetching = (
  state: IsFetchingState = true,
  action: Action
): IsFetchingState => {
  switch (action.type) {
    case "FETCH_CLIENTS":
      return true;

    case "FETCH_CLIENT":
      return true;

    case "FETCH_CLIENTS_SUCCESS":
      return false;

    case "FETCH_CLIENT_SUCCESS":
      return false;

    case "FETCH_CLIENTS_FAILURE":
      return false;

    case "FETCH_CLIENT_FAILURE":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_CLIENTS_SUCCESS":
      return action.meta.count;

    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_CLIENTS_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (state: ResultState = [], action: Action): ResultState => {
  switch (action.type) {
    case "CREATE_CLIENT_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_CLIENT_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_CLIENTS_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "DELETE_CLIENT_SUCCESS":
      const newState = [...state];
      newState.splice(state.indexOf(action.payload.id), 1);
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  isFetching,
  count,
  next,
  result
});
