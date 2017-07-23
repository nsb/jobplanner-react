// @flow
import { normalize } from "normalizr";
import { visitListSchema, visitSchema } from "../schemas";
import visitsApi from "../api";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import history from "../history";

//Create new job
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

export type Visit = {
  id: number,
  job: number,
  line_items: [Object],
  completed: boolean,
  begins: Date,
  ends: Date
};

type VisitsResponse = {
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
  payload: Visit
};

type CreateVisitFailureAction = {
  type: typeof CREATE_VISIT_FAILURE,
  error: string
};

type UpdateVisitAction = {
  type: typeof UPDATE_VISIT,
  payload: Visit
};

type UpdateVisitSuccessAction = {
  type: typeof UPDATE_VISIT_SUCCESS,
  payload: Visit
};

type UpdateVisitFailureAction = {
  type: typeof UPDATE_VISIT_FAILURE,
  error: string
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
  | UpdateVisitFailureAction;

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

export const fetchVisits = (token: string, queryParams: Object = {}) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchVisitsRequest());

    return visitsApi
      .getAll("visits", token, queryParams)
      .then((responseVisits: VisitsResponse) => {
        dispatch(fetchVisitsSuccess(responseVisits));
        return responseVisits;
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

export const createJobSuccess = (payload: Visit): CreateVisitSuccessAction => {
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
) => {
  return (dispatch: Dispatch) => {
    dispatch(createVisitRequest(visit));

    return visitsApi
      .create("visits", visit, token)
      .then((responseVisit: Visit) => {
        dispatch(createJobSuccess(responseVisit));
        history.push(`/${business.id}/visits/${responseVisit.id}`);
        return responseVisit;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const updateVisitRequest = (payload: Visit): UpdateVisitAction => {
  return {
    type: UPDATE_VISIT,
    payload
  };
};

export const updateVisitSuccess = (
  payload: Visit
): UpdateVisitSuccessAction => {
  return {
    type: UPDATE_VISIT_SUCCESS,
    receivedAt: Date.now(),
    payload
  };
};

export const updateVisitError = (error: string): UpdateVisitFailureAction => {
  return {
    type: UPDATE_VISIT_FAILURE,
    error
  };
};

export const updateVisit = (visit: Visit, token: string) => {
  return (dispatch: Dispatch) => {
    dispatch(updateVisitRequest(visit));

    return visitsApi
      .update("visit", visit, token)
      .then((responseVisit: Visit) => {
        dispatch(updateVisitSuccess(responseVisit));
        return responseVisit;
      })
      .catch((error: string) => {
        dispatch(updateVisitError(error));
      });
  };
};
