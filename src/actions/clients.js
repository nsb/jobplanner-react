// @flow
import { normalize } from "normalizr";
import { addSuccess, addError } from "redux-flash-messages";
import { clientListSchema, clientSchema } from "../schemas";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "./businesses";
import type { Property } from "./properties";
import clientsApi from "../api";
import history from "../history";

//Create new client
export const CREATE_CLIENT: "CREATE_CLIENT" = "CREATE_CLIENT";
export const CREATE_CLIENT_SUCCESS: "CREATE_CLIENT_SUCCESS" =
  "CREATE_CLIENT_SUCCESS";
export const CREATE_CLIENT_FAILURE: "CREATE_CLIENT_FAILURE" =
  "CREATE_CLIENT_FAILURE";

//Fetch clients
export const FETCH_CLIENTS: "FETCH_CLIENTS" = "FETCH_CLIENTS";
export const FETCH_CLIENTS_SUCCESS: "FETCH_CLIENTS_SUCCESS" =
  "FETCH_CLIENTS_SUCCESS";
export const FETCH_CLIENTS_FAILURE: "FETCH_CLIENTS_FAILURE" =
  "FETCH_CLIENTS_FAILURE";
export const RESET_CLIENTS: "RESET_CLIENTS" = "RESET_CLIENTS";

export const FETCH_CLIENT: "FETCH_CLIENT" = "FETCH_CLIENT";
export const FETCH_CLIENT_SUCCESS: "FETCH_CLIENT_SUCCESS" =
  "FETCH_CLIENT_SUCCESS";
export const FETCH_CLIENT_FAILURE: "FETCH_CLIENT_FAILURE" =
  "FETCH_CLIENT_FAILURE";

//Update client
export const UPDATE_CLIENT: "UPDATE_CLIENT" = "UPDATE_CLIENT";
export const UPDATE_CLIENT_SUCCESS: "UPDATE_CLIENT_SUCCESS" =
  "UPDATE_CLIENT_SUCCESS";
export const UPDATE_CLIENT_FAILURE: "UPDATE_CLIENT_FAILURE" =
  "UPDATE_CLIENT_FAILURE";

//Delete client
export const DELETE_CLIENT: "DELETE_CLIENT" = "DELETE_CLIENT";
export const DELETE_CLIENT_SUCCESS: "DELETE_CLIENT_SUCCESS" =
  "DELETE_CLIENT_SUCCESS";
export const DELETE_CLIENT_FAILURE: "DELETE_CLIENT_FAILURE" =
  "DELETE_CLIENT_FAILURE";

export type Client = {
  id: number,
  business: number,
  first_name: string,
  last_name: string,
  address1: string,
  address2: string,
  city: string,
  zip_code: string,
  country: string,
  email: string,
  phone: string,
  notes: string,
  properties: Array<Property>,
  upcoming_visit_reminder_email_enabled: boolean,
  is_business: boolean,
  business_name: ?string,
  address_use_property: boolean
};

export type ClientsMap = { [id: number]: Client };

export type ClientsResponse = {
  results: Array<Client>,
  count: number,
  next: ?string,
  previous: ?string
};

type FetchClientsAction = {
  type: typeof FETCH_CLIENTS
};

type FetchClientsSuccessAction = {
  type: typeof FETCH_CLIENTS_SUCCESS,
  payload: { entities: { clients: ClientsMap }, result: Array<number> },
  meta: { count: number, next: ?string, previous: ?string }
};

type FetchClientsFailureAction = {
  type: typeof FETCH_CLIENTS_FAILURE,
  error: string
};

type FetchClientAction = {
  type: typeof FETCH_CLIENT
};

type FetchClientSuccessAction = {
  type: typeof FETCH_CLIENT_SUCCESS,
  payload: { entities: { clients: ClientsMap }, result: number }
};

type FetchClientFailureAction = {
  type: typeof FETCH_CLIENT_FAILURE,
  error: string
};

type CreateClientAction = {
  type: typeof CREATE_CLIENT,
  payload: Client
};

type CreateClientSuccessAction = {
  type: typeof CREATE_CLIENT_SUCCESS,
  payload: { entities: { clients: ClientsMap }, result: number }
};

type CreateClientFailureAction = {
  type: typeof CREATE_CLIENT_FAILURE,
  payload: Client,
  error: string
};

type UpdateClientAction = {
  type: typeof UPDATE_CLIENT,
  payload: Client
};

type UpdateClientSuccessAction = {
  type: typeof UPDATE_CLIENT_SUCCESS,
  payload: Client
};

type UpdateClientFailureAction = {
  type: typeof UPDATE_CLIENT_FAILURE,
  payload: Client,
  error: string
};

type DeleteClientAction = {
  type: typeof DELETE_CLIENT,
  payload: Client
};

type DeleteClientSuccessAction = {
  type: typeof DELETE_CLIENT_SUCCESS,
  payload: Client
};

type DeleteClientFailureAction = {
  type: typeof DELETE_CLIENT_FAILURE,
  payload: Client,
  error: string
};

type ResetClientsAction = {
  type: typeof RESET_CLIENTS
};

export type Action =
  | FetchClientsAction
  | FetchClientsSuccessAction
  | FetchClientsFailureAction
  | FetchClientAction
  | FetchClientSuccessAction
  | FetchClientFailureAction
  | CreateClientAction
  | CreateClientSuccessAction
  | CreateClientFailureAction
  | UpdateClientAction
  | UpdateClientSuccessAction
  | UpdateClientFailureAction
  | DeleteClientAction
  | DeleteClientSuccessAction
  | DeleteClientFailureAction
  | ResetClientsAction

export const fetchClientsRequest = (): FetchClientsAction => {
  return {
    type: FETCH_CLIENTS
  };
};

export const fetchClientsSuccess = (
  response: ClientsResponse
): FetchClientsSuccessAction => {
  return {
    type: FETCH_CLIENTS_SUCCESS,
    payload: normalize(response.results, clientListSchema),
    meta: {
      count: response.count,
      next: response.next,
      previous: response.previous
    },
    receivedAt: Date.now()
  };
};

export const fetchClientsFailure = (
  error: string
): FetchClientsFailureAction => {
  return {
    type: FETCH_CLIENTS_FAILURE,
    error: error
  };
};

export const fetchClients = (
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchClientsRequest());

    return clientsApi
      .getAll("clients", token, queryParams)
      .then((responseClients: ClientsResponse) => {
        dispatch(fetchClientsSuccess(responseClients));
        return responseClients;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const fetchClientRequest = (): FetchClientAction => {
  return {
    type: FETCH_CLIENT
  };
};

export const fetchClientSuccess = (
  payload: Client
): FetchClientSuccessAction => {
  return {
    type: FETCH_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, clientSchema)
  };
};

export const fetchClientFailure = (error: string): FetchClientFailureAction => {
  return {
    type: FETCH_CLIENT_FAILURE,
    error: error
  };
};

export const fetchClient = (token: string, id: number): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(fetchClientsRequest());

    return clientsApi
      .getOne("clients", id, token)
      .then((responseClient: Client) => {
        dispatch(fetchClientSuccess(responseClient));
        return responseClient;
      })
      .catch((error: string) => {
        dispatch(fetchClientsFailure("error"));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const createClientRequest = (payload: Client): CreateClientAction => {
  return {
    type: CREATE_CLIENT,
    payload
  };
};

export const createClientSuccess = (
  payload: Client
): CreateClientSuccessAction => {
  return {
    type: CREATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, clientSchema)
  };
};

export const createClientError = (
  payload: Client,
  error: string
): CreateClientFailureAction => {
  return {
    type: CREATE_CLIENT_FAILURE,
    error,
    payload
  };
};

export const createClient = (
  business: Business,
  client: Client,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(createClientRequest(client));

    return clientsApi
      .create("clients", client, token)
      .then((responseClient: Client) => {
        dispatch(createClientSuccess(responseClient));
        history.push(`/${business.id}/clients/${responseClient.id}`);
        addSuccess({
          text: "Created"
        });
        return responseClient;
      })
      .catch((error: string) => {
        dispatch(createClientError(client, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const updateClientRequest = (payload: Client): UpdateClientAction => {
  return {
    type: UPDATE_CLIENT,
    payload
  };
};

export const updateClientSuccess = (
  payload: Client
): UpdateClientSuccessAction => {
  return {
    type: UPDATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload: normalize(payload, clientSchema)
  };
};

export const updateClientError = (
  payload: Client,
  error: string
): UpdateClientFailureAction => {
  return {
    type: UPDATE_CLIENT_FAILURE,
    error,
    payload
  };
};

export const updateClient = (client: Client, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(updateClientRequest(client));

    return clientsApi
      .update("clients", client, token)
      .then((responseClient: Client) => {
        dispatch(updateClientSuccess(responseClient));
        history.push(`/${client.business}/clients/${responseClient.id}`);
        addSuccess({
          text: "Saved"
        });
        return responseClient;
      })
      .catch((error: string) => {
        dispatch(updateClientError(client, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};

export const deleteClientRequest = (payload: Client): DeleteClientAction => {
  return {
    type: DELETE_CLIENT,
    payload
  };
};

export const deleteClientSuccess = (
  payload: Client
): DeleteClientSuccessAction => {
  return {
    type: DELETE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload
  };
};

export const deleteClientError = (
  payload: Client,
  error: string
): DeleteClientFailureAction => {
  return {
    type: DELETE_CLIENT_FAILURE,
    error,
    payload
  };
};

export const deleteClient = (client: Client, token: string): ThunkAction => {
  return (dispatch: Dispatch) => {
    dispatch(deleteClientRequest(client));

    return clientsApi
      .delete("clients", client, token)
      .then(() => {
        dispatch(deleteClientSuccess(client));
        history.push(`/${client.business}/clients`);
        addSuccess({
          text: "Deleted"
        });
      })
      .catch((error: string) => {
        dispatch(deleteClientError(client, error));
        addError({
          text: "An error occurred"
        });
      });
  };
};
