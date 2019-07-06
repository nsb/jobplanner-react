// @flow
import type { Action } from "../actions/auth";
import type { User } from "../actions/users";

const token = localStorage.getItem("token");

type State = {
  authFailed: boolean,
  busy: boolean,
  token: ?string,
  isAuthenticated: boolean,
  user: ?User
};

const initialState: State = {
  authFailed: false,
  busy: false,
  token: token,
  user: null,
  isAuthenticated: false
};

const authReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return Object.assign({}, state, {
        busy: true
      });

    case "REQUEST_LOGIN_SUCCESS":
      return Object.assign({}, state, {
        token: action.token,
        authFailed: false,
        busy: false,
        isAuthenticated: true
      });

    case "REQUEST_LOGIN_FAILURE":
      return Object.assign({}, state, {
        authFailed: true,
        busy: false
      });

    case "REQUEST_SIGNUP":
      return Object.assign({}, state, {
        busy: true
      });

    case "REQUEST_SIGNUP_SUCCESS":
      return Object.assign({}, state, {
        token: action.payload.token,
        user: action.payload.user,
        busy: false,
        isAuthenticated: true
      });

    case "REQUEST_SIGNUP_FAILURE":
      return Object.assign({}, state, {
        busy: false
      });

    case "REQUEST_VERIFY":
      return Object.assign({}, state, {
        busy: true
      });

    case "REQUEST_VERIFY_SUCCESS":
      return Object.assign({}, state, {
        isAuthenticated: true,
        user: action.user,
        busy: false
      });

    case "REQUEST_VERIFY_FAILURE":
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: null,
        busy: false
      });

    case "REQUEST_REFRESH_SUCCESS":
      return Object.assign({}, state, {
        token: action.token,
        isAuthenticated: true
      });

    case "REQUEST_REFRESH_FAILURE":
      return Object.assign({}, state, {
        token: null,
        isAuthenticated: false
      });

    case "LOGOUT":
      return Object.assign({}, state, {
        authFailed: false,
        token: null
      });

    default:
      return state;
  }
};

export default authReducer;
