// @flow
import type { User, Action } from '../actions/auth'

const token = localStorage.getItem('token');

type State = {
  busy: boolean,
  token: ?string,
  isAuthenticated: boolean,
  user: ?User
}

const initialState: State = {
  busy: false, token: token, user: null, isAuthenticated: false
}

const authReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return Object.assign({}, state, {
        busy: true
      })

    case 'REQUEST_LOGIN_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        busy: false,
        isAuthenticated: true
      })

    case 'REQUEST_LOGIN_FAILURE':
      return Object.assign({}, state, {
        busy: false
      })

    case 'REQUEST_VERIFY':
      return Object.assign({}, state, {
        busy: true
      })

    case 'REQUEST_VERIFY_SUCCESS':
      return Object.assign({}, state, {
        isAuthenticated: true,
        user: action.user,
        busy: false
      })

    case 'REQUEST_VERIFY_FAILURE':
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: null,
        busy: false
      })

    case 'LOGOUT':
      return Object.assign({}, state, {
        token: null
      })


    default:
      return state
  }
}

export default authReducer
