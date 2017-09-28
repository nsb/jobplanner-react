// @flow
import { flatMap } from "lodash/collection";
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/services";

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
    case "FETCH_SERVICES":
      return true;

    case "FETCH_SERVICE":
      return true;

    case "FETCH_SERVICES_SUCCESS":
      return false;

    case "FETCH_SERVICE_SUCCESS":
      return false;

    case "FETCH_SERVICES_FAILURE":
      return false;

    case "FETCH_SERVICE_FAILURE":
      return false;

    case "UPDATE_SERVICE":
      return true;

    case "UPDATE_SERVICE_SUCCESS":
      return false;

    case "UPDATE_SERVICE_FAILURE":
      return false;

    case "FETCH_BUSINESSES_SUCCESS":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_SERVICES_SUCCESS":
      return action.meta.count;

    case "FETCH_BUSINESSES_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.businesses,
          business => business.services
        ).length;
      } else {
        return state;
      }


    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_SERVICES_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (state: ResultState = [], action: Action): ResultState => {
  switch (action.type) {
    case "CREATE_SERVICE_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_SERVICE_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_SERVICES_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "UPDATE_SERVICE_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "DELETE_SERVICE_SUCCESS":
      const newState = [...state];
      newState.splice(state.indexOf(action.payload.id), 1);
      return newState;

    // services are inlined under business entity
    case "FETCH_BUSINESSES_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.businesses,
          business => business.services
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
