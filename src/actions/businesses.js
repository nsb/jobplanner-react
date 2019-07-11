// @flow
import { normalize } from "normalizr";
import { businessListSchema, businessSchema } from "../schemas";
import businessesApi from "../api";
import type { Dispatch, ThunkAction } from "../types/Store";

//Create new business
export const CREATE_BUSINESS: "CREATE_BUSINESS" = "CREATE_BUSINESS";
export const CREATE_BUSINESS_SUCCESS: "CREATE_BUSINESS_SUCCESS" =
  "CREATE_BUSINESS_SUCCESS";
export const CREATE_BUSINESS_FAILURE: "CREATE_BUSINESS_FAILURE" =
  "CREATE_BUSINESS_FAILURE";
export const RESET_NEW_BUSINESS: "RESET_NEW_BUSINESS" = "RESET_NEW_BUSINESS";

//Fetch businesses
export const FETCH_BUSINESSES: "FETCH_BUSINESSES" = "FETCH_BUSINESSES";
export const FETCH_BUSINESSES_SUCCESS: "FETCH_BUSINESSES_SUCCESS" =
  "FETCH_BUSINESSES_SUCCESS";
export const FETCH_BUSINESSES_FAILURE: "FETCH_BUSINESSES_FAILURE" =
  "FETCH_BUSINESSES_FAILURE";
export const RESET_BUSINESSES: "RESET_BUSINESSES" = "RESET_BUSINESSES";

//Update business
export const UPDATE_BUSINESS: "UPDATE_BUSINESS" = "UPDATE_BUSINESS";
export const UPDATE_BUSINESS_SUCCESS: "UPDATE_BUSINESS_SUCCESS" =
  "UPDATE_BUSINESS_SUCCESS";
export const UPDATE_BUSINESS_FAILURE: "UPDATE_BUSINESS_FAILURE" =
  "UPDATE_BUSINESS_FAILURE";

export type Business = {
  id: number,
  name: string,
  timezone: string,
  services: Array<number>
};

export type BusinessesMap = { [id: number]: Business };

type BusinessResponse = {
  results: Array<Business>,
  count: number,
  next: ?string,
  previous: ?string
};

type FetchBusinessesAction = {
  type: typeof FETCH_BUSINESSES
};

type FetchBusinessesSuccessAction = {
  type: typeof FETCH_BUSINESSES_SUCCESS,
  meta: { count: number, next: ?string, previous: ?string },
  payload: {
    entities: { businesses: BusinessesMap },
    result: Array<number>
  }
};

type FetchBusinessesFailureAction = {
  type: typeof FETCH_BUSINESSES_FAILURE,
  error: string
};

type CreateBusinessAction = {
  type: typeof CREATE_BUSINESS,
  payload: Business
};

type CreateBusinessSuccessAction = {
  type: typeof CREATE_BUSINESS_SUCCESS,
  payload: {
    entities: { businesses: BusinessesMap },
    result: number
  }
};

type CreateBusinessFailureAction = {
  type: typeof CREATE_BUSINESS_FAILURE,
  error: string
};

type UpdateBusinessAction = {
  type: typeof UPDATE_BUSINESS,
  payload: Business | { id: number }
};

type UpdateBusinessSuccessAction = {
  type: typeof UPDATE_BUSINESS_SUCCESS,
  payload: Business
};

type UpdateBusinessFailureAction = {
  type: typeof UPDATE_BUSINESS_FAILURE,
  error: string
};

export type Action =
  | FetchBusinessesAction
  | FetchBusinessesSuccessAction
  | FetchBusinessesFailureAction
  | CreateBusinessAction
  | CreateBusinessSuccessAction
  | CreateBusinessFailureAction
  | UpdateBusinessAction
  | UpdateBusinessSuccessAction
  | UpdateBusinessFailureAction;

const parse = (business): Business => {
  return business;
};

export const fetchBusinessesRequest = (): FetchBusinessesAction => {
  return {
    type: FETCH_BUSINESSES
  };
};

export const fetchBusinessesSuccess = (
  response: BusinessResponse
): FetchBusinessesSuccessAction => {
  return {
    type: FETCH_BUSINESSES_SUCCESS,
    payload: normalize(response.results, businessListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    }
  };
};

export const fetchBusinessesFailure = (
  error: string
): FetchBusinessesFailureAction => {
  return {
    type: FETCH_BUSINESSES_FAILURE,
    error: error
  };
};

export const fetchBusinesses = (token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchBusinessesRequest());

    return businessesApi
      .getAll("businesses", token)
      .then((responseBusinesses: BusinessResponse) => {
        dispatch(fetchBusinessesSuccess(responseBusinesses));
        return responseBusinesses;
      })
      .catch((error: string) => {
        dispatch(fetchBusinessesFailure(error));
      });
  };
};

export const createBusinessRequest = (
  payload: Business
): CreateBusinessAction => {
  return {
    type: CREATE_BUSINESS,
    payload
  };
};

export const createBusinessSuccess = (
  payload: Business
): CreateBusinessSuccessAction => {
  return {
    type: CREATE_BUSINESS_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, businessSchema)
  };
};

export const createBusinessError = (
  error: string
): CreateBusinessFailureAction => {
  return {
    type: CREATE_BUSINESS_FAILURE,
    error: error
  };
};

export const createBusiness = (data: Business, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createBusinessRequest(data));

    return businessesApi
      .create("businesses", data, token)
      .then((responseBusiness: Business) => {
        dispatch(createBusinessSuccess(responseBusiness));
        return responseBusiness;
      })
      .catch((error: string) => {
        dispatch(createBusinessError(error));
        throw error;
      });
  };
};

export const updateBusinessRequest = (
  payload: Business | { id: number }
): UpdateBusinessAction => {
  return {
    type: UPDATE_BUSINESS,
    payload
  };
};

export const updateBusinessSuccess = (
  payload: Business
): UpdateBusinessSuccessAction => {
  return {
    type: UPDATE_BUSINESS_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, businessSchema)
  };
};

export const updateBusinessError = (
  error: string
): UpdateBusinessFailureAction => {
  return {
    type: UPDATE_BUSINESS_FAILURE,
    error
  };
};

export const updateBusiness = (
  business: Business,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateBusinessRequest(business));

    return businessesApi
      .update("businesses", business, token)
      .then((responseBusiness: Business) => {
        dispatch(updateBusinessSuccess(responseBusiness));
        return responseBusiness;
      })
      .catch((error: string) => {
        dispatch(updateBusinessError(error));
        throw error;
      });
  };
};

export const partialUpdateBusiness = (
  business: { id: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateBusinessRequest(business));

    return businessesApi
      .update("businesses", business, token, true)
      .then((responseBusiness: Business) => {
        const coercedBusiness = parse(responseBusiness);
        dispatch(updateBusinessSuccess(coercedBusiness));
        return coercedBusiness;
      })
      .catch((error: string) => {
        dispatch(updateBusinessError(error));
        throw error;
      });
  };
};
