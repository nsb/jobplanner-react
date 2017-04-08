// @flow
import { combineReducers } from 'redux'
import { merge } from 'lodash/object'
import { CREATE_CLIENT_SUCCESS,
         UPDATE_CLIENT_SUCCESS,
         FETCH_CLIENTS,
         FETCH_CLIENTS_SUCCESS,
         FETCH_CLIENTS_FAILURE } from '../actions'

const isFetching = (state: boolean = false, action: Object): boolean => {
  switch (action.type) {
    case FETCH_CLIENTS:
      return true

    case FETCH_CLIENTS_SUCCESS:
      return false

    case FETCH_CLIENTS_FAILURE:
      return false

    default:
      return state
  }
}

const clients = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CLIENT_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload
        }
      }

    case UPDATE_CLIENT_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }

    case FETCH_CLIENTS_SUCCESS:
      if (action.payload && action.payload.entities && action.payload.entities.clients) {
        return merge({}, state, action.payload.entities.clients)
      }
      return state

    default:
     return state
  }
}

const entities = combineReducers({
  clients,
})

const result = (state = [], action) => {
  switch (action.type) {
    case CREATE_CLIENT_SUCCESS:
      return [...state, action.payload.id]

    case FETCH_CLIENTS_SUCCESS:
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
