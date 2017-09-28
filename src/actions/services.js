// @flow
import { normalize } from "normalizr";
import { serviceListSchema, serviceSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "./businesses";
import servicesApi from "../api";
import history from "../history";

//Create new service
export const CREATE_SERVICE: "CREATE_SERVICE" = "CREATE_SERVICE";
export const CREATE_SERVICE_SUCCESS: "CREATE_SERVICE_SUCCESS" =
  "CREATE_SERVICE_SUCCESS";
export const CREATE_SERVICE_FAILURE: "CREATE_SERVICE_FAILURE" =
  "CREATE_SERVICE_FAILURE";

//Fetch services
export const FETCH_SERVICES: "FETCH_SERVICES" = "FETCH_SERVICES";
export const FETCH_SERVICES_SUCCESS: "FETCH_SERVICES_SUCCESS" =
  "FETCH_SERVICES_SUCCESS";
export const FETCH_SERVICES_FAILURE: "FETCH_SERVICES_FAILURE" =
  "FETCH_SERVICES_FAILURE";

export const FETCH_SERVICE: "FETCH_SERVICE" = "FETCH_SERVICE";
export const FETCH_SERVICE_SUCCESS: "FETCH_SERVICE_SUCCESS" =
  "FETCH_SERVICE_SUCCESS";
export const FETCH_SERVICE_FAILURE: "FETCH_SERVICE_FAILURE" =
  "FETCH_SERVICE_FAILURE";

//Update service
export const UPDATE_SERVICE: "UPDATE_SERVICE" = "UPDATE_SERVICE";
export const UPDATE_SERVICE_SUCCESS: "UPDATE_SERVICE_SUCCESS" =
  "UPDATE_SERVICE_SUCCESS";
export const UPDATE_SERVICE_FAILURE: "UPDATE_SERVICE_FAILURE" =
  "UPDATE_SERVICE_FAILURE";

//Delete service
export const DELETE_SERVICE: "DELETE_SERVICE" = "DELETE_SERVICE";
export const DELETE_SERVICE_SUCCESS: "DELETE_SERVICE_SUCCESS" =
  "DELETE_SERVICE_SUCCESS";
export const DELETE_SERVICE_FAILURE: "DELETE_SERVICE_FAILURE" =
  "DELETE_SERVICE_FAILURE";

export type Service = {
  id: number,
  business: number,
  name: string,
  description: string,
  unit_cost: number
};

export type ServicesMap = { [id: number]: Service };

export type ServicesResponse = {
  results: Array<Service>,
  count: number,
  next: ?string,
  previous: ?string
};

type FetchServicesAction = {
  type: typeof FETCH_SERVICES
};

type FetchServicesSuccessAction = {
  type: typeof FETCH_SERVICES_SUCCESS,
  payload: { entities: { services: ServicesMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string }
};

type FetchServicesFailureAction = {
  type: typeof FETCH_SERVICES_FAILURE,
  error: string
};

type FetchServiceAction = {
  type: typeof FETCH_SERVICE
};

type FetchServiceSuccessAction = {
  type: typeof FETCH_SERVICE_SUCCESS,
  payload: Service
};

type FetchServiceFailureAction = {
  type: typeof FETCH_SERVICE_FAILURE,
  error: string
};

type CreateServiceAction = {
  type: typeof CREATE_SERVICE,
  payload: Service
};

type CreateServiceSuccessAction = {
  type: typeof CREATE_SERVICE_SUCCESS,
  payload: { entities: { services: ServicesMap }, result: number }
};

type CreateServiceFailureAction = {
  type: typeof CREATE_SERVICE_FAILURE,
  payload: Service,
  error: string
};

type UpdateServiceAction = {
  type: typeof UPDATE_SERVICE,
  payload: Service
};

type UpdateServiceSuccessAction = {
  type: typeof UPDATE_SERVICE_SUCCESS,
  payload: Service
};

type UpdateServiceFailureAction = {
  type: typeof UPDATE_SERVICE_FAILURE,
  payload: Service,
  error: string
};

type DeleteServiceAction = {
  type: typeof DELETE_SERVICE,
  payload: Service
};

type DeleteServiceSuccessAction = {
  type: typeof DELETE_SERVICE_SUCCESS,
  payload: Service
};

type DeleteServiceFailureAction = {
  type: typeof DELETE_SERVICE_FAILURE,
  payload: Service,
  error: string
};

export type Action =
  | FetchServicesAction
  | FetchServicesSuccessAction
  | FetchServicesFailureAction
  | FetchServiceAction
  | FetchServiceSuccessAction
  | FetchServiceFailureAction
  | CreateServiceAction
  | CreateServiceSuccessAction
  | CreateServiceFailureAction
  | UpdateServiceAction
  | UpdateServiceSuccessAction
  | UpdateServiceFailureAction
  | DeleteServiceAction
  | DeleteServiceSuccessAction
  | DeleteServiceFailureAction;

export const fetchServicesRequest = (): FetchServicesAction => {
  return {
    type: FETCH_SERVICES
  };
};

export const fetchServicesSuccess = (
  response: ServicesResponse
): FetchServicesSuccessAction => {
  return {
    type: FETCH_SERVICES_SUCCESS,
    payload: normalize(response.results, serviceListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    },
    receivedAt: Date.now()
  };
};

export const fetchServicesFailure = (
  error: string
): FetchServicesFailureAction => {
  return {
    type: FETCH_SERVICES_FAILURE,
    error: error
  };
};

export const fetchServices = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchServicesRequest());

    return servicesApi
      .getAll("services", token, queryParams)
      .then((responseServices: ServicesResponse) => {
        dispatch(fetchServicesSuccess(responseServices));
        return responseServices;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchServiceRequest = (): FetchServiceAction => {
  return {
    type: FETCH_SERVICE
  };
};

export const fetchServiceSuccess = (
  payload: Service
): FetchServiceSuccessAction => {
  return {
    type: FETCH_SERVICE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, serviceSchema)
  };
};

export const fetchServiceFailure = (error: string): FetchServiceFailureAction => {
  return {
    type: FETCH_SERVICE_FAILURE,
    error: error
  };
};

export const fetchService = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchServicesRequest());

    return servicesApi
      .getOne("services", id, token)
      .then((responseService: Service) => {
        dispatch(fetchServiceSuccess(responseService));
        return responseService;
      })
      .catch((error: string) => {
        dispatch(fetchServicesFailure("error"));
      });
  };
};

export const createServiceRequest = (payload: Service): CreateServiceAction => {
  return {
    type: CREATE_SERVICE,
    payload
  };
};

export const createServiceSuccess = (
  payload: Service
): CreateServiceSuccessAction => {
  return {
    type: CREATE_SERVICE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, serviceSchema)
  };
};

export const createServiceError = (
  payload: Service,
  error: string
): CreateServiceFailureAction => {
  return {
    type: CREATE_SERVICE_FAILURE,
    error,
    payload
  };
};

export const createService = (
  service: Service,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createServiceRequest(service));

    return servicesApi
      .create("services", service, token)
      .then((responseService: Service) => {
        dispatch(createServiceSuccess(responseService));
        return responseService;
      })
      .catch((error: string) => {
        dispatch(createServiceError(service, error));
      });
  };
};

export const updateServiceRequest = (payload: Service): UpdateServiceAction => {
  return {
    type: UPDATE_SERVICE,
    payload
  };
};

export const updateServiceSuccess = (
  payload: Service
): UpdateServiceSuccessAction => {
  return {
    type: UPDATE_SERVICE_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, serviceSchema)
  };
};

export const updateServiceError = (
  payload: Service,
  error: string
): UpdateServiceFailureAction => {
  return {
    type: UPDATE_SERVICE_FAILURE,
    error,
    payload
  };
};

export const updateService = (service: Service, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateServiceRequest(service));

    return servicesApi
      .update("services", service, token)
      .then((responseService: Service) => {
        dispatch(updateServiceSuccess(responseService));
        return responseService;
      })
      .catch((error: string) => {
        dispatch(updateServiceError(service, error));
      });
  };
};

export const deleteServiceRequest = (payload: Service): DeleteServiceAction => {
  return {
    type: DELETE_SERVICE,
    payload
  };
};

export const deleteServiceSuccess = (
  payload: Service
): DeleteServiceSuccessAction => {
  return {
    type: DELETE_SERVICE_SUCCESS,
    receivedAt: Date.now(),
    payload
  };
};

export const deleteServiceError = (
  payload: Service,
  error: string
): DeleteServiceFailureAction => {
  return {
    type: DELETE_SERVICE_FAILURE,
    error,
    payload
  };
};

export const deleteService = (service: Service, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteServiceRequest(service));

    return servicesApi
      .delete("services", service, token)
      .then(() => {
        dispatch(deleteServiceSuccess(service));
        history.push(`/${service.business}/services`);
      })
      .catch((error: string) => {
        dispatch(deleteServiceError(service, error));
      });
  };
};
