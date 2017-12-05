// @flow
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/visits";

const isFetching = (state: boolean = true, action: Action): boolean => {
  switch (action.type) {
    case "FETCH_VISITS":
      return true;

    case "FETCH_VISITS_SUCCESS":
      return false;

    case "FETCH_VISITS_FAILURE":
      return false;

    case "UPDATE_VISIT":
      return true;

    case "UPDATE_VISIT_SUCCESS":
      return false;

    case "UPDATE_VISIT_FAILURE":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_VISITS_SUCCESS":
      return action.meta.count;

    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_VISITS_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case "CREATE_VISIT_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_VISITS_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "UPDATE_VISIT_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "RESET_VISITS":
      return [];

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
