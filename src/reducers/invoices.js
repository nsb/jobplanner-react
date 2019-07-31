// @flow
import { combineReducers } from "redux";
import { union } from "lodash/array";
import type { Action } from "../actions/invoices";

type IsFetchingState = boolean;
type ResultState = Array<number>;
export type State = {
  isFetching: IsFetchingState,
  result: ResultState
};

const isFetching = (
  state: IsFetchingState = false,
  action: Action
): IsFetchingState => {
  switch (action.type) {
    case "FETCH_INVOICES":
      return true;

    case "FETCH_INVOICE":
      return true;

    case "FETCH_INVOICES_SUCCESS":
      return false;

    case "FETCH_INVOICE_SUCCESS":
      return false;

    case "FETCH_INVOICES_FAILURE":
      return false;

    case "FETCH_INVOICE_FAILURE":
      return false;

    case "CREATE_INVOICE":
      return true;

    case "CREATE_INVOICE_SUCCESS":
      return false;

    case "CREATE_INVOICE_FAILURE":
      return false;

    default:
      return state;
  }
};

const count = (state: number = 0, action: Action): number => {
  switch (action.type) {
    case "FETCH_INVOICES_SUCCESS":
      return action.meta.count;

    default:
      return state;
  }
};

const next = (state: ?string = null, action: Action): ?string => {
  switch (action.type) {
    case "FETCH_INVOICES_SUCCESS":
      return action.meta.next;

    default:
      return state;
  }
};

const result = (state: ResultState = [], action: Action): ResultState => {
  switch (action.type) {
    case "FETCH_INVOICE_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "FETCH_INVOICES_SUCCESS":
      if (action.payload && action.payload.result) {
        return union(state, action.payload.result);
      } else {
        return state;
      }

    case "DELETE_INVOICE_SUCCESS":
      const newState = [...state];
      newState.splice(state.indexOf(action.payload.id), 1);
      return newState;

    case "RESET_INVOICES":
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
