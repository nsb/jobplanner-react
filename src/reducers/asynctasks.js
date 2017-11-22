// @flow
import { combineReducers } from "redux";
import type { Action } from "../actions/asynctasks";

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
    case "FETCH_ASYNCTASK":
      return true;

    case "FETCH_ASYNCTASK_SUCCESS":
      return false;

    case "FETCH_ASYNCTASK_FAILURE":
      return false;

    default:
      return state;
  }
};

const result = (state: ResultState = [], action: Action): ResultState => {
  switch (action.type) {
    case "FETCH_ASYNCTASK_SUCCESS":
      if (action.payload && action.payload.result) {
        return [...state, action.payload.result];
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default combineReducers({
  isFetching,
  result
});
