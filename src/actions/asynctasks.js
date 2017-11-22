// @flow
import { normalize } from "normalizr";
import { asyncTaskSchema } from "../schemas";
import asyncTasksApi from "../api";
import type { Dispatch, ThunkAction } from "../types/Store";

//Fetch asyncTask
export const FETCH_ASYNCTASK: "FETCH_ASYNCTASK" = "FETCH_ASYNCTASK";
export const FETCH_ASYNCTASK_SUCCESS: "FETCH_ASYNCTASK_SUCCESS" =
  "FETCH_ASYNCTASK_SUCCESS";
export const FETCH_ASYNCTASK_FAILURE: "FETCH_ASYNCTASK_FAILURE" =
  "FETCH_ASYNCTASK_FAILURE";

export type AsyncTaskState =
  | "PENDING"
  | "STARTED"
  | "SUCCESS"
  | "FAILURE"
  | "REVOKED";

export type AsyncTask = {
  id: number,
  state: AsyncTaskState,
  progress: number,
  results: ?Object
};

export type AsyncTasksMap = { [id: number]: AsyncTask };

type FetchAsyncTaskAction = {
  type: typeof FETCH_ASYNCTASK
};

type FetchAsyncTaskSuccessAction = {
  type: typeof FETCH_ASYNCTASK_SUCCESS,
  payload: { entities: { asyncTasks: AsyncTasksMap }, result: number }
};

type FetchAsyncTaskFailureAction = {
  type: typeof FETCH_ASYNCTASK_FAILURE,
  error: string
};

export type Action =
  | FetchAsyncTaskAction
  | FetchAsyncTaskSuccessAction
  | FetchAsyncTaskFailureAction;

export const fetchAsyncTaskRequest = (): FetchAsyncTaskAction => {
  return {
    type: FETCH_ASYNCTASK
  };
};

export const fetchAsyncTaskSuccess = (
  payload: AsyncTask
): FetchAsyncTaskSuccessAction => {
  return {
    type: FETCH_ASYNCTASK_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, asyncTaskSchema)
  };
};

export const fetchAsyncTaskFailure = (
  error: string
): FetchAsyncTaskFailureAction => {
  return {
    type: FETCH_ASYNCTASK_FAILURE,
    error: error
  };
};

export const fetchAsyncTask = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchAsyncTaskRequest());

    return asyncTasksApi
      .getOne("asynctasks", id, token)
      .then((responseAsyncTask: AsyncTask) => {
        dispatch(fetchAsyncTaskSuccess(responseAsyncTask));
        return responseAsyncTask;
      })
      .catch((error: string) => {
        dispatch(fetchAsyncTaskFailure("error"));
      });
  };
};
