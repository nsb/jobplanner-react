import { combineReducers } from 'redux'
import { merge } from 'lodash/object'
import { CREATE_BUSINESS_SUCCESS,
         FETCH_BUSINESSES,
         FETCH_BUSINESSES_SUCCESS,
         FETCH_BUSINESSES_FAILURE } from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_BUSINESSES:
      return true

    case FETCH_BUSINESSES_SUCCESS:
      return false

    case FETCH_BUSINESSES_FAILURE:
      return false

    default:
      return state
  }
}

const businesses = (state = {}, action) => {
  switch (action.type) {
    case CREATE_BUSINESS_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload
        }
      }

    case 'UPDATE_BUSINESS':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }

    case FETCH_BUSINESSES_SUCCESS:
      if (action.payload && action.payload.entities && action.payload.entities.businesses) {
        return merge({}, state, action.payload.entities.businesses)
      }
      return state

    default:
    return state
  }
}

const entities = combineReducers({
  businesses,
})

const result = (state = [], action) => {
  switch (action.type) {
    case CREATE_BUSINESS_SUCCESS:
      return [...state, action.payload.id]

    case FETCH_BUSINESSES_SUCCESS:
      if (action.payload && action.payload.result) {
        return merge({}, state, action.payload.result)
      }
      return state

    default:
      return state
    }
}

export default combineReducers({
  isFetching,
  entities,
  result,
})
