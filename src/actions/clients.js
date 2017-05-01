// @flow
import {push} from 'react-router-redux';
import {normalize} from 'normalizr';
import {clientListSchema} from '../schemas';
import type {Dispatch} from '../types/Store';
import clientsApi from '../api';

//Create new client
export const CREATE_CLIENT: 'CREATE_CLIENT' = 'CREATE_CLIENT';
export const CREATE_CLIENT_SUCCESS: 'CREATE_CLIENT_SUCCESS' =
  'CREATE_CLIENT_SUCCESS';
export const CREATE_CLIENT_FAILURE: 'CREATE_CLIENT_FAILURE' =
  'CREATE_CLIENT_FAILURE';

//Fetch clients
export const FETCH_CLIENTS: 'FETCH_CLIENTS' = 'FETCH_CLIENTS';
export const FETCH_CLIENTS_SUCCESS: 'FETCH_CLIENTS_SUCCESS' =
  'FETCH_CLIENTS_SUCCESS';
export const FETCH_CLIENTS_FAILURE: 'FETCH_CLIENTS_FAILURE' =
  'FETCH_CLIENTS_FAILURE';

//Update client
export const UPDATE_CLIENT: 'UPDATE_CLIENT' = 'UPDATE_CLIENT';
export const UPDATE_CLIENT_SUCCESS: 'UPDATE_CLIENT_SUCCESS' =
  'UPDATE_CLIENT_SUCCESS';
export const UPDATE_CLIENT_FAILURE: 'UPDATE_CLIENT_FAILURE' =
  'UPDATE_CLIENT_FAILURE';

export type Client = {
  id: number,
  first_name: string,
  last_name: string,
};

type FetchClientsAction = {
  type: typeof FETCH_CLIENTS,
};

type FetchClientsSuccessAction = {
  type: typeof FETCH_CLIENTS_SUCCESS,
  payload: {entities: {clients: {[id: number]: Client}}, result: Array<number>},
};

type FetchClientsFailureAction = {
  type: typeof FETCH_CLIENTS_FAILURE,
  error: string,
};

type CreateClientAction = {
  type: typeof CREATE_CLIENT,
  payload: Client,
};

type CreateClientSuccessAction = {
  type: typeof CREATE_CLIENT_SUCCESS,
  payload: Client,
};

type CreateClientFailureAction = {
  type: typeof CREATE_CLIENT_FAILURE,
  payload: Client,
  error: string,
};

type UpdateClientAction = {
  type: typeof UPDATE_CLIENT,
  payload: Client,
};

type UpdateClientSuccessAction = {
  type: typeof UPDATE_CLIENT_SUCCESS,
  payload: Client,
};

type UpdateClientFailureAction = {
  type: typeof UPDATE_CLIENT_FAILURE,
  payload: Client,
  error: string,
};

export type Action =
  | FetchClientsAction
  | FetchClientsSuccessAction
  | FetchClientsFailureAction
  | CreateClientAction
  | CreateClientSuccessAction
  | CreateClientFailureAction
  | UpdateClientAction
  | UpdateClientSuccessAction
  | UpdateClientFailureAction;

export const fetchClientsRequest = (): FetchClientsAction => {
  return {
    type: FETCH_CLIENTS,
  };
};

export const fetchClientsSuccess = (
  clients: Array<Client>
): FetchClientsSuccessAction => {
  return {
    type: FETCH_CLIENTS_SUCCESS,
    payload: normalize(clients, clientListSchema),
    receivedAt: Date.now(),
  };
};

export const fetchClientsFailure = (
  error: string
): FetchClientsFailureAction => {
  return {
    type: FETCH_CLIENTS_FAILURE,
    error: error,
  };
};

export const fetchClients = (token: string, queryParams: Object = {}) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchClientsRequest());

    return clientsApi
      .getAll('clients', token, queryParams)
      .then((responseClients: Array<Client>) => {
        if (Array.isArray(responseClients)) {
          dispatch(fetchClientsSuccess(responseClients));
        } else {
          dispatch(fetchClientsFailure('error'));
        }
        return responseClients;
      })
      .catch((error: string) => {
        throw error;
      });
  };
};

export const createClientRequest = (payload: Client): CreateClientAction => {
  return {
    type: CREATE_CLIENT,
    payload,
  };
};

export const createClientSuccess = (
  payload: Client
): CreateClientSuccessAction => {
  return {
    type: CREATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload,
  };
};

export const createClientError = (
  payload: Client,
  error: string
): CreateClientFailureAction => {
  return {
    type: CREATE_CLIENT_FAILURE,
    error,
    payload,
  };
};

export const createClient = (
  business: Object,
  client: Client,
  token: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(createClientRequest(client));

    return clientsApi
      .create('clients', client, token)
      .then((responseClient: Client) => {
        dispatch(createClientSuccess(responseClient));
        dispatch(push(`/${business.id}/clients/${responseClient.id}`));
        return responseClient;
      })
      .catch((error: string) => {
        dispatch(createClientError(client, error));
      });
  };
};

export const updateClientRequest = (payload: Client): UpdateClientAction => {
  return {
    type: UPDATE_CLIENT,
    payload,
  };
};

export const updateClientSuccess = (
  payload: Client
): UpdateClientSuccessAction => {
  return {
    type: UPDATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload,
  };
};

export const updateClientError = (
  payload: Client,
  error: string
): UpdateClientFailureAction => {
  return {
    type: UPDATE_CLIENT_FAILURE,
    error,
    payload,
  };
};

export const updateClient = (client: Client, token: string) => {
  return (dispatch: Dispatch) => {
    dispatch(updateClientRequest(client));

    return clientsApi
      .update('clients', client, token)
      .then((responseClient: Client) => {
        dispatch(updateClientSuccess(responseClient));
        return responseClient;
      })
      .catch((error: string) => {
        dispatch(updateClientError(client, error));
      });
  };
};
