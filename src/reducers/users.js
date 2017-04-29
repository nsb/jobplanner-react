// @flow
import {combineReducers} from 'redux';
import type {Action, User} from '../actions/users';

const isFetching = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    case 'REQUEST_ME':
      return true;

    case 'REQUEST_ME_SUCCESS':
      return false;

    case 'REQUEST_ME_FAILURE':
      return false;

    default:
      return state;
  }
};

const me = (state: ?User = null, action: Action): ?User => {
  switch (action.type) {
    case 'REQUEST_ME_SUCCESS':
      return Object.assign({}, state, action.user);

    default:
      return state;
  }
};

export default combineReducers({
  isFetching,
  me,
});
