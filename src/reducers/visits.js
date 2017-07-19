// @flow
import {combineReducers} from 'redux';
import {merge} from 'lodash/object';
import type {Action} from '../actions/visits';

const isFetching = (state: boolean = true, action: Action): boolean => {
  switch (action.type) {
    case 'FETCH_VISITS':
      return true;

    case 'FETCH_VISITS_SUCCESS':
      return false;

    case 'FETCH_VISITS_FAILURE':
      return false;

    case 'UPDATE_VISIT':
      return true;

    case 'UPDATE_VISIT_SUCCESS':
      return false;

    case 'UPDATE_VISIT_FAILURE':
      return false;

    default:
      return state;
  }
};

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case 'CREATE_VISIT_SUCCESS':
      return [...state, action.payload.id];

    case 'FETCH_VISITS_SUCCESS':
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
  result,
});
