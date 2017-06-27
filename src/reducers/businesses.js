// @flow
import { combineReducers } from "redux";
import { merge } from "lodash/object";
import type { Action } from "../actions/businesses";

// initially set to true https://github.com/reactjs/react-redux/issues/210
const isFetching = (state: boolean = true, action: Action): boolean => {
  switch (action.type) {
    case "FETCH_BUSINESSES":
      return true;

    case "FETCH_BUSINESSES_SUCCESS":
      return false;

    case "FETCH_BUSINESSES_FAILURE":
      return false;

    default:
      return state;
  }
};

const hasLoaded = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    case "FETCH_BUSINESSES_SUCCESS":
      return true;

    default:
      return state;
  }
};

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case "CREATE_BUSINESS_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_BUSINESSES_SUCCESS":
      if (action.payload && action.payload.result) {
        return merge([], state, action.payload.result);
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default combineReducers({
  isFetching,
  hasLoaded,
  result
});
