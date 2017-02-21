import { combineReducers } from 'redux'
import { REQUEST_ME, REQUEST_ME_SUCCESS, REQUEST_ME_FAILURE } from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case REQUEST_ME:
      return true

    case REQUEST_ME_SUCCESS:
      return false

    case REQUEST_ME_FAILURE:
      return false

    default:
      return state
  }
}

const me = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_ME_SUCCESS:
      return Object.assign({}, state, action.user)

    default:
      return state
  }
}

export default combineReducers({
  isFetching,
  me
})
