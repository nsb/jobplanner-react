// @flow
import { flatMap } from "lodash/collection";
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/employees";
import type { Action as BusinessesAction } from "../actions/businesses";

type IsFetchingState = boolean;
type ResultState = Array<number>;
export type State = {
  isFetching: IsFetchingState,
  result: ResultState,
};

const isFetching = (
  state: IsFetchingState = true,
  action: Action | BusinessesAction
): IsFetchingState => {
  switch (action.type) {
    case "FETCH_EMPLOYEES":
      return true;

    case "FETCH_EMPLOYEE":
      return true;

    case "FETCH_EMPLOYEES_SUCCESS":
      return false;

    case "FETCH_EMPLOYEE_SUCCESS":
      return false;

    case "FETCH_EMPLOYEES_FAILURE":
      return false;

    case "FETCH_EMPLOYEE_FAILURE":
      return false;

    case "UPDATE_EMPLOYEE":
      return true;

    case "UPDATE_EMPLOYEE_SUCCESS":
      return false;

    case "UPDATE_EMPLOYEE_FAILURE":
      return false;

    case "FETCH_BUSINESSES_SUCCESS":
      return false;

    case "CREATE_BUSINESS_SUCCESS":
      return false;

    default:
      return state;
  }
};

const count = (
  state: number = 0,
  action: Action | BusinessesAction
): number => {
  switch (action.type) {
    case "FETCH_EMPLOYEES_SUCCESS":
      return action.meta.count;

    case "FETCH_BUSINESSES_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.businesses,
          (business) => business.employees
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
    case "FETCH_EMPLOYEES_SUCCESS":
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
    case "CREATE_EMPLOYEE_SUCCESS":
      return [...state, action.payload.result];

    case "FETCH_EMPLOYEE_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_EMPLOYEES_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "UPDATE_EMPLOYEE_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "DELETE_EMPLOYEE_SUCCESS":
      const newState = [...state];
      newState.splice(state.indexOf(action.payload.id), 1);
      return newState;

    // employees are inlined under business entity
    case "FETCH_BUSINESSES_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.businesses,
          (business) => business.employees
        );
      } else {
        return state;
      }

    // employees are inlined under business entity
    case "CREATE_BUSINESS_SUCCESS":
      if (action.payload && action.payload.entities) {
        return flatMap(
          action.payload.entities.businesses,
          (business) => business.employees
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
