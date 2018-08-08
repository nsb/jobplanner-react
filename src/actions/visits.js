// @flow
import { merge } from "lodash/object";
import { normalize } from "normalizr";
import { addSuccess, addError } from "redux-flash-messages";
import { visitListSchema, visitSchema } from "../schemas";
import visitsApi from "../api";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import { BEGIN, COMMIT, REVERT } from "redux-optimistic-ui";

//Create new visit
export const CREATE_VISIT: "CREATE_VISIT" = "CREATE_VISIT";
export const CREATE_VISIT_SUCCESS: "CREATE_VISIT_SUCCESS" =
  "CREATE_VISIT_SUCCESS";
export const CREATE_VISIT_FAILURE: "CREATE_VISIT_FAILURE" =
  "CREATE_VISIT_FAILURE";
export const RESET_NEW_VISIT: "RESET_NEW_VISIT" = "RESET_NEW_VISIT";

//Fetch visits
export const FETCH_VISITS: "FETCH_VISITS" = "FETCH_VISITS";
export const FETCH_VISITS_SUCCESS: "FETCH_VISITS_SUCCESS" =
  "FETCH_VISITS_SUCCESS";
export const FETCH_VISITS_FAILURE: "FETCH_VISITS_FAILURE" =
  "FETCH_VISITS_FAILURE";
export const RESET_VISITS: "RESET_VISITS" = "RESET_VISITS";

//Update visit
export const UPDATE_VISIT: "UPDATE_VISIT" = "UPDATE_VISIT";
export const UPDATE_VISIT_SUCCESS: "UPDATE_VISIT_SUCCESS" =
  "UPDATE_VISIT_SUCCESS";
export const UPDATE_VISIT_FAILURE: "UPDATE_VISIT_FAILURE" =
  "UPDATE_VISIT_FAILURE";

//Delete visit
export const DELETE_VISIT: "DELETE_VISIT" = "DELETE_VISIT";
export const DELETE_VISIT_SUCCESS: "DELETE_VISIT_SUCCESS" = "DELETE_VISIT_SUCCESS";
export const DELETE_VISIT_FAILURE: "DELETE_VISIT_FAILURE" = "DELETE_VISIT_FAILURE";

export type Visit = {
  id: number,
  business: number,
  job: number,
  property: number,
  line_items: [Object],
  completed: boolean,
  begins: Date,
  ends: Date,
  client_name: string,
  client_phone: string,
  assigned: Array<number>,
  details: string
};

export type VisitsResponse = {
  results: Array<Visit>,
  count: number,
  next: ?string,
  previous: ?string
};

export type VisitsMap = { [id: number]: Visit };

type FetchVisitsAction = {
  type: typeof FETCH_VISITS
};

type FetchVisitsSuccessAction = {
  type: typeof FETCH_VISITS_SUCCESS,
  payload: { entities: { visits: VisitsMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string }
};

type FetchVisitsFailureAction = {
  type: typeof FETCH_VISITS_FAILURE,
  error: string
};

type CreateVisitAction = {
  type: typeof CREATE_VISIT,
  payload: Visit
};

type CreateVisitSuccessAction = {
  type: typeof CREATE_VISIT_SUCCESS,
  payload: { entities: { visits: VisitsMap }, result: number }
};

type CreateVisitFailureAction = {
  type: typeof CREATE_VISIT_FAILURE,
  error: string
};

type UpdateVisitAction = {
  type: typeof UPDATE_VISIT,
  payload: Visit,
  error: boolean,
  meta: {
    isOptimistic: boolean
  }
};

type UpdateVisitSuccessAction = {
  type: typeof UPDATE_VISIT_SUCCESS,
  payload: Visit
};

type UpdateVisitFailureAction = {
  type: typeof UPDATE_VISIT_FAILURE,
  error: string
};

type DeleteVisitAction = {
  type: typeof DELETE_VISIT,
  payload: Visit
};

type DeleteVisitSuccessAction = {
  type: typeof DELETE_VISIT_SUCCESS,
  payload: Visit
};

type DeleteVisitFailureAction = {
  type: typeof DELETE_VISIT_FAILURE,
  payload: Visit,
  error: string
};

type ResetVisitsAction = {
  type: typeof RESET_VISITS
};

export type Action =
  | FetchVisitsAction
  | FetchVisitsSuccessAction
  | FetchVisitsFailureAction
  | CreateVisitAction
  | CreateVisitSuccessAction
  | CreateVisitFailureAction
  | UpdateVisitAction
  | UpdateVisitSuccessAction
  | UpdateVisitFailureAction
  | DeleteVisitAction
  | DeleteVisitSuccessAction
  | DeleteVisitFailureAction
  | ResetVisitsAction;

const parse = (visit): Visit => {
  return merge({}, visit, {
    begins: visit.begins && new Date(visit.begins),
    ends: visit.ends && new Date(visit.ends)
  });
};

export const fetchVisitsRequest = (): FetchVisitsAction => {
  return {
    type: FETCH_VISITS
  };
};

// interface ErrorResponse<S,T> {
//   status: S,
//   statusText: T,
// }
//
// interface JSONResponse<S,J> {
//   status: S,
//   json(): Promise<J>,
// }
//
// type JobsJSON = [Job]
// type DecrementResponse = ErrorResponse<400,string>
//                        | JSONResponse<200,JobsJSON>

export const fetchVisitsSuccess = (
  response: VisitsResponse
): FetchVisitsSuccessAction => {
  return {
    type: FETCH_VISITS_SUCCESS,
    payload: normalize(response.results, visitListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    },
    receivedAt: Date.now()
  };
};

export const fetchVisitsFailure = (error: string): FetchVisitsFailureAction => {
  return {
    type: FETCH_VISITS_FAILURE,
    error: error
  };
};

export const fetchVisits = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchVisitsRequest());

    return visitsApi
      .getAll("visits", token, queryParams)
      .then((responseVisits: VisitsResponse) => {
        const coercedVisits = merge({}, responseVisits, {
          results: responseVisits.results.map(parse)
        });
        dispatch(fetchVisitsSuccess(coercedVisits));
        return coercedVisits;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const createVisitRequest = (payload: Visit): CreateVisitAction => {
  return {
    type: CREATE_VISIT,
    payload
  };
};

export const createVisitSuccess = (
  payload: Visit
): CreateVisitSuccessAction => {
  return {
    type: CREATE_VISIT_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, visitSchema)
  };
};

export const createVisitError = (error: string): CreateVisitFailureAction => {
  return {
    type: CREATE_VISIT_FAILURE,
    error
  };
};

export const createVisit = (
  business: Business,
  visit: Visit,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createVisitRequest(visit));

    return visitsApi
      .create("visits", visit, token)
      .then((responseVisit: Visit) => {
        const coercedVisit = parse(responseVisit);
        dispatch(createVisitSuccess(coercedVisit));
        addSuccess({
          text: "Saved"
        });
        return coercedVisit;
      })
      .catch((error: string) => {
        dispatch(createVisitError(error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

let nextTransactionID = 0;
export const updateVisitRequest = (
  payload: Visit | { id: number },
  optimistic: boolean = false,
  transactionID: number = 0
): UpdateVisitAction => {
  let action = {
    type: UPDATE_VISIT,
    meta: {
      isOptimistic: optimistic
    },
    payload: normalize(payload, visitSchema),
    error: false
  };

  if (optimistic) {
    return Object.assign({}, action, {
      meta: {
        isOptimistic: optimistic,
        optimistic: { type: BEGIN, id: transactionID }
      }
    });
  } else {
    return action;
  }
};

export const updateVisitSuccess = (
  payload: Visit,
  optimistic: boolean = false,
  transactionId: number = 0
): UpdateVisitSuccessAction => {
  let action = {
    type: UPDATE_VISIT_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, visitSchema)
  };

  if (optimistic) {
    return Object.assign({}, action, {
      meta: {
        isOptimistic: optimistic,
        optimistic: { type: COMMIT, id: transactionId }
      }
    });
  } else {
    return action;
  }
};

export const updateVisitError = (
  error: string,
  optimistic: boolean = false,
  transactionID: number = 0
): UpdateVisitFailureAction => {
  let action = {
    type: UPDATE_VISIT_FAILURE,
    error
  };

  if (optimistic) {
    return Object.assign({}, action, {
      meta: {
        isOptimistic: optimistic,
        optimistic: { type: REVERT, id: transactionID }
      }
    });
  } else {
    return action;
  }
};

export const updateVisit = (
  visit: { id: number, begins: Date, ends: Date, anytime: boolean },
  token: string,
  optimistic: boolean = false,
  patch: boolean = false
): ThunkAction => {
  return (dispatch: Dispatch) => {
    let transactionID = nextTransactionID++;
    dispatch(updateVisitRequest(visit, optimistic, transactionID));

    return visitsApi
      .update("visits", visit, token, patch)
      .then((responseVisit: Visit) => {
        const coercedVisit = parse(responseVisit);
        dispatch(updateVisitSuccess(coercedVisit, optimistic, transactionID));
        addSuccess({
          text: "Saved"
        });
        return coercedVisit;
      })
      .catch((error: string) => {
        dispatch(updateVisitError(error, optimistic, transactionID));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const partialUpdateVisit = (
  visit: { id: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateVisitRequest(visit));

    return visitsApi
      .update("visits", visit, token, true)
      .then((responseVisit: Visit) => {
        const coercedVisit = parse(responseVisit);
        dispatch(updateVisitSuccess(coercedVisit));
        return coercedVisit;
      })
      .catch((error: string) => {
        dispatch(updateVisitError(error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const deleteVisitRequest = (payload: Visit): DeleteVisitAction => {
  return {
    type: DELETE_VISIT,
    payload
  };
};

export const deleteVisitSuccess = (payload: Visit): DeleteVisitSuccessAction => {
  return {
    type: DELETE_VISIT_SUCCESS,
    payload
  };
};

export const deleteVisitError = (
  payload: Visit,
  error: string
): DeleteVisitFailureAction => {
  return {
    type: DELETE_VISIT_FAILURE,
    error,
    payload
  };
};

export const deleteVisit = (visit: Visit, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteVisitRequest(visit));

    return visitsApi
      .delete("visits", visit, token)
      .then(() => {
        dispatch(deleteVisitSuccess(visit));
        addSuccess({
          text: "Deleted"
        });
      })
      .catch((error: string) => {
        dispatch(deleteVisitError(visit, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};
