// @flow
import { combineReducers } from "redux";
import { flatMap } from "lodash/collection";
import { union } from "lodash/array";
import type { Action } from "../actions/properties";

const isFetching = (state: boolean = true, action: Action): boolean => {
  switch (action.type) {
    case "FETCH_PROPERTIES":
      return true;

    case "FETCH_PROPERTIES_SUCCESS":
      return false;

    case "FETCH_PROPERTIES_FAILURE":
      return false;

    case "FETCH_PROPERTY":
      return true;

    case "FETCH_PROPERTY_SUCCESS":
      return false;

    case "FETCH_PROPERTY_FAILURE":
      return false;

    case "UPDATE_PROPERTY":
      return true;

    case "UPDATE_PROPERTY_SUCCESS":
      return false;

    case "UPDATE_PROPERTY_FAILURE":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_PROPERTIES_SUCCESS":
      return action.meta.count;

    case "CREATE_PROPERTIES_SUCCESS":
      return state + 1

    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_PROPERTIES_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case "CREATE_PROPERTIES_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_PROPERTY_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_PROPERTIES_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "UPDATE_PROPERTY_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "DELETE_PROPERTY_SUCCESS":
      const newState = [...state];
      newState.splice(state.indexOf(action.payload.id), 1);
      return newState;

    // property is inlined under visit
    case "FETCH_VISITS_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.visits,
          visit => visit.property
        );
      } else {
        return state;
      }

    // property is inlined under job
    case "FETCH_JOBS_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.jobs,
          job => job.property
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
  result
});
