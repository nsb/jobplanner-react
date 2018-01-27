// @flow
import fetch from "isomorphic-fetch";
import Raven from "raven-js";
import authApi from "../api";
import history from "../history";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { User } from "./users";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const REQUEST_LOGIN: "REQUEST_LOGIN" = "REQUEST_LOGIN";
const REQUEST_LOGIN_FAILURE: "REQUEST_LOGIN_FAILURE" = "REQUEST_LOGIN_FAILURE";
const REQUEST_LOGIN_SUCCESS: "REQUEST_LOGIN_SUCCESS" = "REQUEST_LOGIN_SUCCESS";
const REQUEST_SIGNUP: "REQUEST_SIGNUP" = "REQUEST_SIGNUP";
const REQUEST_SIGNUP_FAILURE: "REQUEST_SIGNUP_FAILURE" =
  "REQUEST_SIGNUP_FAILURE";
const REQUEST_SIGNUP_SUCCESS: "REQUEST_SIGNUP_SUCCESS" =
  "REQUEST_SIGNUP_SUCCESS";
const LOGOUT: "LOGOUT" = "LOGOUT";
const REQUEST_VERIFY: "REQUEST_VERIFY" = "REQUEST_VERIFY";
const REQUEST_VERIFY_FAILURE: "REQUEST_VERIFY_FAILURE" =
  "REQUEST_VERIFY_FAILURE";
const REQUEST_VERIFY_SUCCESS: "REQUEST_VERIFY_SUCCESS" =
  "REQUEST_VERIFY_SUCCESS";
const REQUEST_REFRESH: "REQUEST_REFRESH" = "REQUEST_REFRESH";
const REQUEST_REFRESH_FAILURE: "REQUEST_REFRESH_FAILURE" =
  "REQUEST_REFRESH_FAILURE";
const REQUEST_REFRESH_SUCCESS: "REQUEST_REFRESH_SUCCESS" =
  "REQUEST_REFRESH_SUCCESS";

export type Credentials = {
  username: string,
  password: string,
  rememberMe: boolean
};

type AuthResponse = {
  token: string,
  user: User
};

type RequestLoginAction = {
  type: typeof REQUEST_LOGIN,
  username: string,
  password: string,
  rememberMe: boolean
};

type RequestLoginFailureAction = {
  type: typeof REQUEST_LOGIN_FAILURE,
  error: string
};

type RequestLoginSuccessAction = {
  type: typeof REQUEST_LOGIN_SUCCESS,
  token: string
};

type RequestSignupAction = {
  type: typeof REQUEST_SIGNUP,
  user: { username: string }
};

type RequestSignupFailureAction = {
  type: typeof REQUEST_SIGNUP_FAILURE,
  error: string
};

type RequestSignupSuccessAction = {
  type: typeof REQUEST_SIGNUP_SUCCESS,
  payload: AuthResponse
};

type RequestVerifyAction = {
  type: typeof REQUEST_VERIFY,
  token: string
};

type RequestVerifyFacilureAction = {
  type: typeof REQUEST_VERIFY_FAILURE,
  error: string
};

type RequestVerifySuccessAction = {
  type: typeof REQUEST_VERIFY_SUCCESS,
  token: string,
  user: User
};

type RequestRefreshAction = {
  type: typeof REQUEST_REFRESH,
  token: string
};

type RequestRefreshFacilureAction = {
  type: typeof REQUEST_REFRESH_FAILURE,
  error: string
};

type RequestRefreshSuccessAction = {
  type: typeof REQUEST_REFRESH_SUCCESS,
  token: string
};

type LogoutAction = {
  type: typeof LOGOUT
};

export type Action =
  | RequestLoginAction
  | RequestLoginFailureAction
  | RequestLoginSuccessAction
  | RequestSignupAction
  | RequestSignupFailureAction
  | RequestSignupSuccessAction
  | RequestVerifyAction
  | RequestVerifyFacilureAction
  | RequestVerifySuccessAction
  | RequestRefreshAction
  | RequestRefreshFacilureAction
  | RequestRefreshSuccessAction
  | LogoutAction;

export const requestLogin = (
  username: string,
  password: string,
  rememberMe: boolean
): RequestLoginAction => {
  return {
    type: REQUEST_LOGIN,
    username,
    password,
    rememberMe
  };
};

export const receiveLogin = (json: AuthResponse): RequestLoginSuccessAction => {
  return {
    type: REQUEST_LOGIN_SUCCESS,
    token: json.token,
    receivedAt: Date.now()
  };
};

export const receiveLoginError = (error: string): RequestLoginFailureAction => {
  return {
    type: REQUEST_LOGIN_FAILURE,
    error: "Oops"
  };
};

export const login = (credentials: Credentials): ThunkAction => {
  const { username, password, rememberMe } = credentials;
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch: Dispatch) => {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestLogin(username, password, rememberMe));

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`${API_ENDPOINT}/api-token-auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
      .then(response => response.json())
      .then((json: AuthResponse) => {
        if (json.token) {
          localStorage.setItem("token", json.token);
          dispatch(receiveLogin(json));
          Raven.setUserContext({
            email: json.user.email,
            id: json.user.id
          });
          // dispatch(push('/'));
        } else {
          dispatch(receiveLoginError("error"));
        }
      })
      .catch((error: string) => dispatch(receiveLoginError(error)));
  };
};

// Signup

export const requestSignup = (user: {
  username: string
}): RequestSignupAction => {
  return {
    type: REQUEST_SIGNUP,
    user
  };
};

export const receiveSignupSuccess = (
  payload: AuthResponse
): RequestSignupSuccessAction => {
  return {
    type: REQUEST_SIGNUP_SUCCESS,
    payload
  };
};

export const receiveSignupError = (
  error: string
): RequestSignupFailureAction => {
  return {
    type: REQUEST_SIGNUP_FAILURE,
    error: error
  };
};

export const signup = (user: { username: string }): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(requestSignup(user));

    return fetch(`${API_ENDPOINT}/users/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(response => response.json())
      .then((json: AuthResponse) => {
        localStorage.setItem("token", json.token);
        dispatch(receiveSignupSuccess(json));
        history.push("/");
      })
      .catch((error: string) => dispatch(receiveSignupError(error)));
  };
};

// Verify

export const requestVerify = (token: string): RequestVerifyAction => {
  return {
    type: REQUEST_VERIFY,
    token
  };
};

export const receiveVerify = (json: {
  token: string,
  user: User
}): RequestVerifySuccessAction => {
  return {
    type: REQUEST_VERIFY_SUCCESS,
    token: json.token,
    user: json.user,
    receivedAt: Date.now()
  };
};

export const receiveVerifyError = (
  error: string
): RequestVerifyFacilureAction => {
  return {
    type: REQUEST_VERIFY_FAILURE,
    error: error
  };
};

export const verify = (token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(requestVerify(token));

    return authApi
      .create("api-token-verify", { token })
      .then((response: { token: string, user: User }) => {
        dispatch(receiveVerify(response));
        Raven.setUserContext({
          email: response.user.email,
          id: response.user.id
        });
      })
      .catch(error => {
        dispatch(receiveVerifyError(error));
      });
  };
};

// Refresh

export const requestRefresh = (token: string): RequestRefreshAction => {
  return {
    type: REQUEST_REFRESH,
    token
  };
};

export const receiveRefresh = (json: {
  token: string
}): RequestRefreshSuccessAction => {
  return {
    type: REQUEST_REFRESH_SUCCESS,
    token: json.token,
    receivedAt: Date.now()
  };
};

export const receiveRefreshError = (
  error: string
): RequestRefreshFacilureAction => {
  return {
    type: REQUEST_REFRESH_FAILURE,
    error: error
  };
};

export const refresh = (token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(requestRefresh(token));

    return authApi
      .create("api-token-refresh", { token })
      .then((response: { token: string }) => {
        localStorage.setItem("token", token);
        dispatch(receiveRefresh(response));
      })
      .catch(error => {
        dispatch(receiveRefreshError(error));
      });
  };
};

// Logout

export const logout = (): LogoutAction => {
  localStorage.removeItem("token");
  Raven.setUserContext();
  return {
    type: LOGOUT
  };
};
