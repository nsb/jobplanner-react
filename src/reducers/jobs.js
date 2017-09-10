// @flow
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/jobs";

const saved = (state: boolean = false, action: any): boolean => {
  switch (action.type) {
    case "@@redux-form/SET_SUBMIT_SUCCEEDED":
      return true
      // if (action.meta && action.meta.form) {
      //   if (action.meta.form === "job") {
      //     return true;
      //   }
      // }
      // return state;

    case "CLEAR_JOB_NOTIFICATIONS":
      return false

    default:
      return state;
  }
};

const isFetching = (state: boolean = true, action: Action): boolean => {
  switch (action.type) {
    case "FETCH_JOBS":
      return true;

    case "FETCH_JOBS_SUCCESS":
      return false;

    case "FETCH_JOBS_FAILURE":
      return false;

    case "FETCH_JOB":
      return true;

    case "FETCH_JOB_SUCCESS":
      return false;

    case "FETCH_JOB_FAILURE":
      return false;

    case "UPDATE_JOB":
      return true;

    case "UPDATE_JOB_SUCCESS":
      return false;

    case "UPDATE_JOB_FAILURE":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_JOBS_SUCCESS":
      return action.meta.count;

    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_JOBS_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case "CREATE_JOB_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_JOB_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_JOBS_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "UPDATE_JOB_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default combineReducers({
  saved,
  isFetching,
  count,
  next,
  result
});
