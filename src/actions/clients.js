// @flow
import { push } from 'react-router-redux'
import { normalize } from 'normalizr'
import { clientListSchema } from '../schemas'
import type { Dispatch as ReduxDispatch } from 'redux'
import clientsApi from '../api'

//Create new client
export const CREATE_CLIENT: string = 'CREATE_CLIENT';
export const CREATE_CLIENT_SUCCESS: string = 'CREATE_CLIENT_SUCCESS';
export const CREATE_CLIENT_FAILURE: string = 'CREATE_CLIENT_FAILURE';

//Fetch clients
export const FETCH_CLIENTS: string = 'FETCH_CLIENTS'
export const FETCH_CLIENTS_SUCCESS: string = 'FETCH_CLIENTS_SUCCESS'
export const FETCH_CLIENTS_FAILURE: string = 'FETCH_CLIENTS_FAILURE'

//Update client
export const UPDATE_CLIENT: string = 'UPDATE_CLIENT'
export const UPDATE_CLIENT_SUCCESS: string = 'UPDATE_CLIENT_SUCCESS'
export const UPDATE_CLIENT_FAILURE: string = 'UPDATE_CLIENT_FAILURE'

type Client = {
  id: number,
  first_name: string,
  last_name: string
}

type FetchClientsAction = {
  type: string
}

type CreateClientAction = {
  type: string,
  payload: Client
}

type UpdateClientAction = {
  type: string,
  payload: Client
}

export type Action =
  | FetchClientsAction
  | CreateClientAction
  | UpdateClientAction

export const fetchClientsRequest = (): FetchClientsAction => {
  return {
    type: FETCH_CLIENTS
  }
}

export const fetchClientsSuccess = (clients: [Client]) => {
  return {
    type: FETCH_CLIENTS_SUCCESS,
    payload: normalize(clients, clientListSchema),
    receivedAt: Date.now()
  }
}

export const fetchClientsFailure = (error: string) => {
  return {
    type: FETCH_CLIENTS_FAILURE,
    error: error
  }
}

export const fetchClients = (token: string, queryParams: Object = {}) => {

  return (dispatch: ReduxDispatch<FetchClientsAction>) => {

    dispatch(fetchClientsRequest())

    return clientsApi.getAll('clients', token, queryParams).then(responseClients => {
      if (Array.isArray(responseClients)) {
        dispatch(fetchClientsSuccess(responseClients))
      } else {
        dispatch(fetchClientsFailure(responseClients))
      }
      return responseClients
    }).catch(error => {
      throw(error)
    })
  }
}


export const createClientRequest = (payload: Client): CreateClientAction => {

  return {
    type: CREATE_CLIENT,
    payload
  }
}

export const createClientSuccess = (payload: Client) => {
  return {
    type: CREATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload
  }
}

export const createClientError = (payload: Client, error: string) => {
  return {
    type: CREATE_CLIENT_FAILURE,
    error,
    payload
  }
}


export const createClient = (business: Object, client: Client, token: string) => {

  return (dispatch: ReduxDispatch<CreateClientAction>) => {

    dispatch(createClientRequest(client))

    return clientsApi.create('clients', client, token).then(responseClient => {
          dispatch(createClientSuccess(responseClient))
          dispatch(push(`/${business.id}/clients/${responseClient.id}`))
          return responseClient
        }).catch(error => {
          dispatch(createClientError(client, error))
        })
  }
}


export const updateClientRequest = (payload: Client): UpdateClientAction => {

  return {
    type: UPDATE_CLIENT,
    payload
  }
}

export const updateClientSuccess = (payload: Client) => {
  return {
    type: UPDATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload
  }
}

export const updateClientError = (payload: Client, error: string) => {
  return {
    type: UPDATE_CLIENT_FAILURE,
    error,
    payload
  }
}


export const updateClient = (client: Client, token: string) => {

  return (dispatch: ReduxDispatch<UpdateClientAction>) => {

    dispatch(updateClientRequest(client))

    return clientsApi.update('clients', client, token).then(responseClient => {
      dispatch(updateClientSuccess(responseClient))
      return responseClient
    }).catch(error => {
      dispatch(updateClientError(client, error))
    })
  }
}
