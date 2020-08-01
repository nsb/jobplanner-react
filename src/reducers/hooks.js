// @flow
import { flatMap } from "lodash/collection";
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/hooks";
import type { Action as BusinessesAction } from "../actions/businesses";

type IsFetchingState = boolean;
type ResultState = Array<number>;
export type State = {
  isFetching: IsFetchingState,
  result: ResultState,
};

const isFetching = (
  state: IsFetchingState = false,
  action: Action
): IsFetchingState => {
  switch (action.type) {
    case "FETCH_HOOKS":
      return true;

    case "FETCH_HOOK":
      return true;

    case "FETCH_HOOKS_SUCCESS":
      return false;

    case "FETCH_HOOK_SUCCESS":
      return false;

    case "FETCH_HOOKS_FAILURE":
      return false;

    case "FETCH_HOOK_FAILURE":
      return false;

    case "CREATE_HOOK":
      return true;

    case "CREATE_HOOK_SUCCESS":
      return false;

    case "CREATE_HOOK_FAILURE":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_HOOKS_SUCCESS":
      return action.meta.count;

    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_HOOKS_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (
  state: ResultState = [],
  action: Action | BusinessesAction
): ResultState => {
  switch (action.type) {
    case "FETCH_HOOK_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_HOOKS_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "DELETE_HOOK_SUCCESS":
      const newState = [...state];
      newState.splice(state.indexOf(action.payload.id), 1);
      return newState;

    case "RESET_HOOKS":
      return [];

    // hooks are inlined under business entity
    case "FETCH_BUSINESSES_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.businesses,
          (business) => business.hooks
        );
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default combineReducers({
  isFetching,
  count,
  next,
  result,
});
