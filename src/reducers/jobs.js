import { combineReducers } from 'redux'
import { merge } from 'lodash/object'
import { CREATE_JOB_SUCCESS,
         FETCH_JOBS,
         FETCH_JOBS_SUCCESS,
         FETCH_JOBS_FAILURE } from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_JOBS:
      return true

    case FETCH_JOBS_SUCCESS:
      return false

    case FETCH_JOBS_FAILURE:
      return false

    default:
      return state
  }
}

const jobs = (state = {}, action) => {
  switch (action.type) {
    case CREATE_JOB_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload
        }
      }

    case 'UPDATE_JOBS':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }

    case FETCH_JOBS_SUCCESS:
      if (action.payload && action.payload.entities && action.payload.entities.jobs) {
        return merge({}, state, action.payload.entities.jobs)
      }
      return state

    default:
     return state
  }
}

const entities = combineReducers({
  jobs,
})

const result = (state = [], action) => {
  switch (action.type) {
    case CREATE_JOB_SUCCESS:
      return [...state, action.payload.id]

    case FETCH_JOBS_SUCCESS:
      if (action.payload && action.payload.result) {
        return merge([], state, action.payload.result)
      } else {
        return state
      }

    default:
      return state
    }
}

export default combineReducers({
  isFetching,
  entities,
  result,
})
