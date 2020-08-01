// @flow
import { normalize } from "normalizr";
import { hookListSchema, hookSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import hooksApi from "../api";

//Create new hook
export const CREATE_HOOK: "CREATE_HOOK" = "CREATE_HOOK";
export const CREATE_HOOK_SUCCESS: "CREATE_HOOK_SUCCESS" = "CREATE_HOOK_SUCCESS";
export const CREATE_HOOK_FAILURE: "CREATE_HOOK_FAILURE" = "CREATE_HOOK_FAILURE";

//Fetch hooks
export const FETCH_HOOKS: "FETCH_HOOKS" = "FETCH_HOOKS";
export const FETCH_HOOKS_SUCCESS: "FETCH_HOOKS_SUCCESS" = "FETCH_HOOKS_SUCCESS";
export const FETCH_HOOKS_FAILURE: "FETCH_HOOKS_FAILURE" = "FETCH_HOOKS_FAILURE";
export const RESET_HOOKS: "RESET_HOOKS" = "RESET_HOOKS";

export const FETCH_HOOK: "FETCH_HOOK" = "FETCH_HOOK";
export const FETCH_HOOK_SUCCESS: "FETCH_HOOK_SUCCESS" = "FETCH_HOOK_SUCCESS";
export const FETCH_HOOK_FAILURE: "FETCH_HOOK_FAILURE" = "FETCH_HOOK_FAILURE";

//Update hook
export const UPDATE_HOOK: "UPDATE_HOOK" = "UPDATE_HOOK";
export const UPDATE_HOOK_SUCCESS: "UPDATE_HOOK_SUCCESS" = "UPDATE_HOOK_SUCCESS";
export const UPDATE_HOOK_FAILURE: "UPDATE_HOOK_FAILURE" = "UPDATE_HOOK_FAILURE";

//Delete hook
export const DELETE_HOOK: "DELETE_HOOK" = "DELETE_HOOK";
export const DELETE_HOOK_SUCCESS: "DELETE_HOOK_SUCCESS" = "DELETE_HOOK_SUCCESS";
export const DELETE_HOOK_FAILURE: "DELETE_HOOK_FAILURE" = "DELETE_HOOK_FAILURE";

export type Hook = {
  id: number,
  business: number,
  name: string,
  identifier: string,
  target: string,
  event: "invoice.added",
  is_active: boolean,
};

export type HookRequest = Hook;

export type HooksMap = { [id: number]: HookRequest };

export type HooksResponse = {
  results: Array<Hook>,
  count: number,
  next: ?string,
  previous: ?string,
};

type FetchHooksAction = {
  type: typeof FETCH_HOOKS,
};

type FetchHooksSuccessAction = {
  type: typeof FETCH_HOOKS_SUCCESS,
  payload: { entities: { hooks: HooksMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string },
};

type FetchHooksFailureAction = {
  type: typeof FETCH_HOOKS_FAILURE,
  error: string,
};

type FetchHookAction = {
  type: typeof FETCH_HOOK,
};

type FetchHookSuccessAction = {
  type: typeof FETCH_HOOK_SUCCESS,
  payload: { entities: { hooks: HooksMap }, result: number },
};

type FetchHookFailureAction = {
  type: typeof FETCH_HOOK_FAILURE,
  error: string,
};

type CreateHookAction = {
  type: typeof CREATE_HOOK,
  payload: HookRequest,
};

type CreateHookSuccessAction = {
  type: typeof CREATE_HOOK_SUCCESS,
  payload: { entities: { hooks: HooksMap }, result: number },
};

type CreateHookFailureAction = {
  type: typeof CREATE_HOOK_FAILURE,
  payload: HookRequest,
  error: string,
};

type UpdateHookAction = {
  type: typeof UPDATE_HOOK,
  payload: HookRequest | { id: number },
};

type UpdateHookSuccessAction = {
  type: typeof UPDATE_HOOK_SUCCESS,
  payload: Hook,
};

type UpdateHookFailureAction = {
  type: typeof UPDATE_HOOK_FAILURE,
  payload: Hook | { id: number },
  error: string,
};

type DeleteHookAction = {
  type: typeof DELETE_HOOK,
  payload: Hook,
};

type DeleteHookSuccessAction = {
  type: typeof DELETE_HOOK_SUCCESS,
  payload: Hook,
};

type DeleteHookFailureAction = {
  type: typeof DELETE_HOOK_FAILURE,
  payload: Hook,
  error: string,
};

type ResetHooksAction = {
  type: typeof RESET_HOOKS,
};

export type Action =
  | FetchHooksAction
  | FetchHooksSuccessAction
  | FetchHooksFailureAction
  | FetchHookAction
  | FetchHookSuccessAction
  | FetchHookFailureAction
  | CreateHookAction
  | CreateHookSuccessAction
  | CreateHookFailureAction
  | UpdateHookAction
  | UpdateHookSuccessAction
  | UpdateHookFailureAction
  | DeleteHookAction
  | DeleteHookSuccessAction
  | DeleteHookFailureAction
  | ResetHooksAction;

export const fetchHooksRequest = (): FetchHooksAction => {
  return {
    type: FETCH_HOOKS,
  };
};

export const fetchHooksSuccess = (
  response: HooksResponse
): FetchHooksSuccessAction => {
  return {
    type: FETCH_HOOKS_SUCCESS,
    payload: normalize(response.results, hookListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous,
    },
    receivedAt: Date.now(),
  };
};

export const fetchHooksFailure = (error: string): FetchHooksFailureAction => {
  return {
    type: FETCH_HOOKS_FAILURE,
    error: error,
  };
};

export const fetchHooks = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchHooksRequest());

    return hooksApi
      .getAll("hooks", token, queryParams)
      .then((responseHooks: HooksResponse) => {
        dispatch(fetchHooksSuccess(responseHooks));
        return responseHooks;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchHookRequest = (): FetchHookAction => {
  return {
    type: FETCH_HOOK,
  };
};

export const fetchHookSuccess = (payload: Hook): FetchHookSuccessAction => {
  return {
    type: FETCH_HOOK_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, hookSchema),
  };
};

export const fetchHookFailure = (error: string): FetchHookFailureAction => {
  return {
    type: FETCH_HOOK_FAILURE,
    error: error,
  };
};

export const fetchHook = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchHooksRequest());

    return hooksApi
      .getOne("hooks", id, token)
      .then((responseHook: Hook) => {
        dispatch(fetchHookSuccess(responseHook));
        return responseHook;
      })
      .catch((error: string) => {
        dispatch(fetchHooksFailure("error"));
        return error;
      });
  };
};

export const createHookRequest = (payload: HookRequest): CreateHookAction => {
  return {
    type: CREATE_HOOK,
    payload,
  };
};

export const createHookSuccess = (
  payload: HookRequest
): CreateHookSuccessAction => {
  return {
    type: CREATE_HOOK_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, hookSchema),
  };
};

export const createHookError = (
  payload: HookRequest,
  error: string
): CreateHookFailureAction => {
  return {
    type: CREATE_HOOK_FAILURE,
    error,
    payload,
  };
};

export const createHook = (hook: HookRequest, token: string): ThunkAction => {
  return (dispatch: Dispatch): Promise<Hook | Array<Hook> | string> => {
    dispatch(createHookRequest(hook));

    return hooksApi
      .create("hooks", hook, token)
      .then((responseHook: Hook) => {
        dispatch(createHookSuccess(responseHook));
        return responseHook;
      })
      .catch((error: string) => {
        dispatch(createHookError(hook, error));
        return error;
      });
  };
};

export const updateHookRequest = (
  payload: HookRequest | { id: number }
): UpdateHookAction => {
  return {
    type: UPDATE_HOOK,
    payload,
  };
};

export const updateHookSuccess = (payload: Hook): UpdateHookSuccessAction => {
  return {
    type: UPDATE_HOOK_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, hookSchema),
  };
};

export const updateHookError = (
  payload: Hook | { id: number },
  error: string
): UpdateHookFailureAction => {
  return {
    type: UPDATE_HOOK_FAILURE,
    error,
    payload,
  };
};

export const updateHook = (hook: Hook, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateHookRequest(hook));

    return hooksApi
      .update("hooks", hook, token)
      .then((responseHook: Hook) => {
        dispatch(updateHookSuccess(responseHook));
        return responseHook;
      })
      .catch((error: string) => {
        dispatch(updateHookError(hook, error));
        return error;
      });
  };
};

export const partialUpdateHook = (
  hook: { id: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateHookRequest(hook));

    return hooksApi
      .update("hooks", hook, token, true)
      .then((responseHook: Hook) => {
        const coercedHook = responseHook;
        dispatch(updateHookSuccess(coercedHook));
        return coercedHook;
      })
      .catch((error: string) => {
        dispatch(updateHookError(hook, error));
        return error;
      });
  };
};

export const deleteHookRequest = (payload: Hook): DeleteHookAction => {
  return {
    type: DELETE_HOOK,
    payload,
  };
};

export const deleteHookSuccess = (payload: Hook): DeleteHookSuccessAction => {
  return {
    type: DELETE_HOOK_SUCCESS,
    receivedAt: Date.now(),
    payload,
  };
};

export const deleteHookError = (
  payload: Hook,
  error: string
): DeleteHookFailureAction => {
  return {
    type: DELETE_HOOK_FAILURE,
    error,
    payload,
  };
};

export const deleteHook = (hook: Hook, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteHookRequest(hook));

    return hooksApi
      .delete("hooks", hook, token)
      .then(() => {
        dispatch(deleteHookSuccess(hook));
        return hook;
      })
      .catch((error: string) => {
        dispatch(deleteHookError(hook, error));
        return error;
      });
  };
};
