// @flow
import { normalize } from "normalizr";
import { addSuccess, addError } from "redux-flash-messages";
import { fieldListSchema, fieldSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import fieldsApi from "../api";
import history from "../history";

//Create new field
export const CREATE_FIELD: "CREATE_FIELD" = "CREATE_FIELD";
export const CREATE_FIELD_SUCCESS: "CREATE_FIELD_SUCCESS" =
  "CREATE_FIELD_SUCCESS";
export const CREATE_FIELD_FAILURE: "CREATE_FIELD_FAILURE" =
  "CREATE_FIELD_FAILURE";

//Fetch fields
export const FETCH_FIELDS: "FETCH_FIELDS" = "FETCH_FIELDS";
export const FETCH_FIELDS_SUCCESS: "FETCH_FIELDS_SUCCESS" =
  "FETCH_FIELDS_SUCCESS";
export const FETCH_FIELDS_FAILURE: "FETCH_FIELDS_FAILURE" =
  "FETCH_FIELDS_FAILURE";

export const FETCH_FIELD: "FETCH_FIELD" = "FETCH_FIELD";
export const FETCH_FIELD_SUCCESS: "FETCH_FIELD_SUCCESS" =
  "FETCH_FIELD_SUCCESS";
export const FETCH_FIELD_FAILURE: "FETCH_FIELD_FAILURE" =
  "FETCH_FIELD_FAILURE";

//Update field
export const UPDATE_FIELD: "UPDATE_FIELD" = "UPDATE_FIELD";
export const UPDATE_FIELD_SUCCESS: "UPDATE_FIELD_SUCCESS" =
  "UPDATE_FIELD_SUCCESS";
export const UPDATE_FIELD_FAILURE: "UPDATE_FIELD_FAILURE" =
  "UPDATE_FIELD_FAILURE";

//Delete field
export const DELETE_FIELD: "DELETE_FIELD" = "DELETE_FIELD";
export const DELETE_FIELD_SUCCESS: "DELETE_FIELD_SUCCESS" =
  "DELETE_FIELD_SUCCESS";
export const DELETE_FIELD_FAILURE: "DELETE_FIELD_FAILURE" =
  "DELETE_FIELD_FAILURE";

export type Field = {
  id: number,
  business: number,
  name: string,
  description: string,
  label: string,
  type: 'text' | 'radio' | 'number'
};

export type FieldsMap = { [id: number]: Field };

export type FieldsResponse = {
  results: Array<Field>,
  count: number,
  next: ?string,
  previous: ?string
};

type FetchFieldsAction = {
  type: typeof FETCH_FIELDS
};

type FetchFieldsSuccessAction = {
  type: typeof FETCH_FIELDS_SUCCESS,
  payload: { entities: { fields: FieldsMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string }
};

type FetchFieldsFailureAction = {
  type: typeof FETCH_FIELDS_FAILURE,
  error: string
};

type FetchFieldAction = {
  type: typeof FETCH_FIELD
};

type FetchFieldSuccessAction = {
  type: typeof FETCH_FIELD_SUCCESS,
  payload: { entities: { fields: FieldsMap }, result: number }
};

type FetchFieldFailureAction = {
  type: typeof FETCH_FIELD_FAILURE,
  error: string
};

type CreateFieldAction = {
  type: typeof CREATE_FIELD,
  payload: Field
};

type CreateFieldSuccessAction = {
  type: typeof CREATE_FIELD_SUCCESS,
  payload: { entities: { fields: FieldsMap }, result: number }
};

type CreateFieldFailureAction = {
  type: typeof CREATE_FIELD_FAILURE,
  payload: Field,
  error: string
};

type UpdateFieldAction = {
  type: typeof UPDATE_FIELD,
  payload: Field
};

type UpdateFieldSuccessAction = {
  type: typeof UPDATE_FIELD_SUCCESS,
  payload: { entities: { fields: FieldsMap }, result: number }
};

type UpdateFieldFailureAction = {
  type: typeof UPDATE_FIELD_FAILURE,
  payload: Field,
  error: string
};

type DeleteFieldAction = {
  type: typeof DELETE_FIELD,
  payload: Field
};

type DeleteFieldSuccessAction = {
  type: typeof DELETE_FIELD_SUCCESS,
  payload: Field
};

type DeleteFieldFailureAction = {
  type: typeof DELETE_FIELD_FAILURE,
  payload: Field,
  error: string
};

export type Action =
  | FetchFieldsAction
  | FetchFieldsSuccessAction
  | FetchFieldsFailureAction
  | FetchFieldAction
  | FetchFieldSuccessAction
  | FetchFieldFailureAction
  | CreateFieldAction
  | CreateFieldSuccessAction
  | CreateFieldFailureAction
  | UpdateFieldAction
  | UpdateFieldSuccessAction
  | UpdateFieldFailureAction
  | DeleteFieldAction
  | DeleteFieldSuccessAction
  | DeleteFieldFailureAction;

export const fetchFieldsRequest = (): FetchFieldsAction => {
  return {
    type: FETCH_FIELDS
  };
};

export const fetchFieldsSuccess = (
  response: FieldsResponse
): FetchFieldsSuccessAction => {
  return {
    type: FETCH_FIELDS_SUCCESS,
    payload: normalize(response.results, fieldListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    },
    receivedAt: Date.now()
  };
};

export const fetchFieldsFailure = (
  error: string
): FetchFieldsFailureAction => {
  return {
    type: FETCH_FIELDS_FAILURE,
    error: error
  };
};

export const fetchFields = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchFieldsRequest());

    return fieldsApi
      .getAll("fields", token, queryParams)
      .then((responseFields: FieldsResponse) => {
        dispatch(fetchFieldsSuccess(responseFields));
        return responseFields;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchFieldRequest = (): FetchFieldAction => {
  return {
    type: FETCH_FIELD
  };
};

export const fetchFieldSuccess = (
  payload: Field
): FetchFieldSuccessAction => {
  return {
    type: FETCH_FIELD_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, fieldSchema)
  };
};

export const fetchFieldFailure = (
  error: string
): FetchFieldFailureAction => {
  return {
    type: FETCH_FIELD_FAILURE,
    error: error
  };
};

export const fetchField = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchFieldsRequest());

    return fieldsApi
      .getOne("fields", id, token)
      .then((responseField: Field) => {
        dispatch(fetchFieldSuccess(responseField));
        return responseField;
      })
      .catch((error: string) => {
        dispatch(fetchFieldsFailure("error"));
      });
  };
};

export const createFieldRequest = (payload: Field): CreateFieldAction => {
  return {
    type: CREATE_FIELD,
    payload
  };
};

export const createFieldSuccess = (
  payload: Field
): CreateFieldSuccessAction => {
  return {
    type: CREATE_FIELD_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, fieldSchema)
  };
};

export const createFieldError = (
  payload: Field,
  error: string
): CreateFieldFailureAction => {
  return {
    type: CREATE_FIELD_FAILURE,
    error,
    payload
  };
};

export const createField = (field: Field, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createFieldRequest(field));

    return fieldsApi
      .create("fields", field, token)
      .then((responseField: Field) => {
        dispatch(createFieldSuccess(responseField));
        addSuccess({
          text: "Saved"
        });
        return responseField;
      })
      .catch((error: string) => {
        dispatch(createFieldError(field, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const updateFieldRequest = (payload: Field): UpdateFieldAction => {
  return {
    type: UPDATE_FIELD,
    payload
  };
};

export const updateFieldSuccess = (
  payload: Field
): UpdateFieldSuccessAction => {
  return {
    type: UPDATE_FIELD_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, fieldSchema)
  };
};

export const updateFieldError = (
  payload: Field,
  error: string
): UpdateFieldFailureAction => {
  return {
    type: UPDATE_FIELD_FAILURE,
    error,
    payload
  };
};

export const updateField = (field: Field, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateFieldRequest(field));

    return fieldsApi
      .update("fields", field, token)
      .then((responseField: Field) => {
        dispatch(updateFieldSuccess(responseField));
        addSuccess({
          text: "Saved"
        });
        return responseField;
      })
      .catch((error: string) => {
        dispatch(updateFieldError(field, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const deleteFieldRequest = (payload: Field): DeleteFieldAction => {
  return {
    type: DELETE_FIELD,
    payload
  };
};

export const deleteFieldSuccess = (
  payload: Field
): DeleteFieldSuccessAction => {
  return {
    type: DELETE_FIELD_SUCCESS,
    receivedAt: Date.now(),
    payload
  };
};

export const deleteFieldError = (
  payload: Field,
  error: string
): DeleteFieldFailureAction => {
  return {
    type: DELETE_FIELD_FAILURE,
    error,
    payload
  };
};

export const deleteField = (field: Field, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteFieldRequest(field));

    return fieldsApi
      .delete("fields", field, token)
      .then(() => {
        dispatch(deleteFieldSuccess(field));
        history.push(`/${field.business}/fields`);
        addSuccess({
          text: "Deleted"
        });
      })
      .catch((error: string) => {
        dispatch(deleteFieldError(field, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};
