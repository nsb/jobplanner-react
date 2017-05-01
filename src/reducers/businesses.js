// @flow
import {combineReducers} from 'redux';
import {merge} from 'lodash/object';
import type {Action, BusinessesMap} from '../actions/businesses';

const isFetching = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    case 'FETCH_BUSINESSES':
      return true;

    case 'FETCH_BUSINESSES_SUCCESS':
      return false;

    case 'FETCH_BUSINESSES_FAILURE':
      return false;

    default:
      return state;
  }
};

const hasLoaded = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    case 'FETCH_BUSINESSES_SUCCESS':
      return true;

    default:
      return state;
  }
};

const businesses = (
  state: BusinessesMap = {},
  action: Action
): BusinessesMap => {
  switch (action.type) {
    case 'CREATE_BUSINESS_SUCCESS':
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
        },
      };

    // case 'UPDATE_BUSINESS':
    //   return {
    //     ...state,
    //     [action.payload.id]: {
    //       ...state[action.payload.id],
    //       ...action.payload,
    //     },
    //   };

    case 'FETCH_BUSINESSES_SUCCESS':
      if (
        action.payload &&
        action.payload.entities &&
        action.payload.entities.businesses
      ) {
        return merge({}, state, action.payload.entities.businesses);
      }
      return state;

    default:
      return state;
  }
};

const entities = combineReducers({
  businesses,
});

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case 'CREATE_BUSINESS_SUCCESS':
      return [...state, action.payload.id];

    case 'FETCH_BUSINESSES_SUCCESS':
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
  entities,
  result,
});
