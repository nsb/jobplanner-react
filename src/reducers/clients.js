// @flow
import {combineReducers} from 'redux';
import {merge} from 'lodash/object';
import type {Action} from '../actions/clients';

const isFetching = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    case 'FETCH_CLIENTS':
      return true;

    case 'FETCH_CLIENTS_SUCCESS':
      return false;

    case 'FETCH_CLIENTS_FAILURE':
      return false;

    default:
      return state;
  }
};

const clients = (state: Object = {}, action: Action): Object => {
  switch (action.type) {
    case 'CREATE_CLIENT_SUCCESS':
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
        },
      };

    case 'UPDATE_CLIENT_SUCCESS':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };

    case 'FETCH_CLIENTS_SUCCESS':
      if (
        action.payload &&
        action.payload.entities &&
        action.payload.entities.clients
      ) {
        return merge({}, state, action.payload.entities.clients);
      }
      return state;

    default:
      return state;
  }
};

const entities = combineReducers({
  clients,
});

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case 'CREATE_CLIENT_SUCCESS':
      return [...state, action.payload.id];

    case 'FETCH_CLIENTS_SUCCESS':
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
  entities,
  result,
});
