// @flow
// import {push} from 'react-router-redux';
import usersApi from "../api/UsersApi";
import type { Dispatch } from "../types/Store";

export const REQUEST_ME: "REQUEST_ME" = "REQUEST_ME";
export const REQUEST_ME_FAILURE: "REQUEST_ME_FAILURE" = "REQUEST_ME_FAILURE";
export const REQUEST_ME_SUCCESS: "REQUEST_ME_SUCCESS" = "REQUEST_ME_SUCCESS";

export type User = {
  id: number,
  url: string,
  username: string,
  first_name: string,
  last_name: string,
  email: string
};

type RequestMeAction = {
  type: typeof REQUEST_ME,
  token: string
};

type RequestMeSuccessAction = {
  type: typeof REQUEST_ME_SUCCESS,
  user: User
};

type RequestMeFailureAction = {
  type: typeof REQUEST_ME_FAILURE,
  error: string
};

export type Action =
  | RequestMeAction
  | RequestMeSuccessAction
  | RequestMeFailureAction;

export const requestMe = (token: string): RequestMeAction => {
  return {
    type: REQUEST_ME,
    token
  };
};

export const receiveMe = (user: User): RequestMeSuccessAction => {
  return {
    type: REQUEST_ME_SUCCESS,
    receivedAt: Date.now(),
    user
  };
};

export const receiveMeError = (error: string): RequestMeFailureAction => {
  return {
    type: REQUEST_ME_FAILURE,
    error
  };
};

export const me = (token: string) => {
  return (dispatch: Dispatch) => {
    dispatch(requestMe(token));

    return usersApi
      .getMe(token)
      .then((responseUser: User) => {
        if (responseUser.id) {
          dispatch(receiveMe(responseUser));
        } else {
          dispatch(receiveMeError("error"));
          // dispatch(push('/login'));
        }
        return responseUser;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};
