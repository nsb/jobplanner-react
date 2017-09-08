// @flow
import fetch from "isomorphic-fetch";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { User } from "./users";

const REQUEST_LOGIN: "REQUEST_LOGIN" = "REQUEST_LOGIN";
const REQUEST_LOGIN_FAILURE: "REQUEST_LOGIN_FAILURE" = "REQUEST_LOGIN_FAILURE";
const REQUEST_LOGIN_SUCCESS: "REQUEST_LOGIN_SUCCESS" = "REQUEST_LOGIN_SUCCESS";
const LOGOUT: "LOGOUT" = "LOGOUT";
const REQUEST_VERIFY: "REQUEST_VERIFY" = "REQUEST_VERIFY";
const REQUEST_VERIFY_FAILURE: "REQUEST_VERIFY_FAILURE" =
  "REQUEST_VERIFY_FAILURE";
const REQUEST_VERIFY_SUCCESS: "REQUEST_VERIFY_SUCCESS" =
  "REQUEST_VERIFY_SUCCESS";

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

type LogoutAction = {
  type: typeof LOGOUT
};

export type Action =
  | RequestLoginAction
  | RequestLoginFailureAction
  | RequestLoginSuccessAction
  | RequestVerifyAction
  | RequestVerifyFacilureAction
  | RequestVerifySuccessAction
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

    return fetch("http://localhost:8000/api-token-auth/", {
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
          // dispatch(push('/'));
        } else {
          dispatch(receiveLoginError("error"));
        }
      })
      .catch((error: string) => dispatch(receiveLoginError(error)));
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
    error: "Oops"
  };
};

export const verify = (token: string): ThunkAction => {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch: Dispatch) => {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestVerify(token));

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch("http://localhost:8000/api-token-verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    })
      .then((response: Response) =>
        response.json().then((json: { token: string, user: User }) => ({
          status: response.status,
          json
        }))
      )
      .then(({ status, json }) => {
        if (status >= 400) {
          dispatch(receiveVerifyError("error"));
        } else {
          dispatch(receiveVerify(json));
        }
      })
      .catch((error: string) => {
        dispatch(receiveVerifyError(error));
      });
  };
};

export const logout = (): LogoutAction => {
  return {
    type: LOGOUT
  };
};
