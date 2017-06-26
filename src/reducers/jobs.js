// @flow
import {combineReducers} from 'redux';
import {merge} from 'lodash/object';
import type {Action} from '../actions/jobs';

const isFetching = (state: boolean = false, action: Action): boolean => {
  switch (action.type) {
    case 'FETCH_JOBS':
      return true;

    case 'FETCH_JOBS_SUCCESS':
      return false;

    case 'FETCH_JOBS_FAILURE':
      return false;

    case 'UPDATE_JOB':
      return true;

    case 'UPDATE_JOB_SUCCESS':
      return false;

    case 'UPDATE_JOB_FAILURE':
      return false;

    default:
      return state;
  }
};

// const jobs = (state: JobsMap = {}, action: Action): JobsMap => {
//   switch (action.type) {
//     case 'CREATE_JOB_SUCCESS':
//       return {
//         ...state,
//         [action.payload.id]: {
//           ...action.payload,
//         },
//       };
//
//     case 'UPDATE_JOB_SUCCESS':
//       return {
//         ...state,
//         [action.payload.id]: {
//           ...state[action.payload.id],
//           ...action.payload,
//         },
//       };
//
//     case 'FETCH_JOBS_SUCCESS':
//       if (
//         action.payload &&
//         action.payload.entities &&
//         action.payload.entities.jobs
//       ) {
//         return merge({}, state, action.payload.entities.jobs);
//       }
//       return state;
//
//     default:
//       return state;
//   }
// };
//
// const entities = combineReducers({
//   jobs,
// });

const result = (state: Array<number> = [], action: Action): Array<number> => {
  switch (action.type) {
    case 'CREATE_JOB_SUCCESS':
      return [...state, action.payload.id];

    case 'FETCH_JOBS_SUCCESS':
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
  // entities,
  result,
});
