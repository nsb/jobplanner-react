import { push } from 'react-router-redux'
import { normalize } from 'normalizr'
import { clientListSchema } from '../schemas'
import clientsApi from '../api/ClientsApi'

//Create new client
export const CREATE_CLIENT = 'CREATE_CLIENT';
export const CREATE_CLIENT_SUCCESS = 'CREATE_CLIENT_SUCCESS';
export const CREATE_CLIENT_FAILURE = 'CREATE_CLIENT_FAILURE';

//Fetch clients
export const FETCH_CLIENTS = 'FETCH_CLIENTS'
export const FETCH_CLIENTS_SUCCESS = 'FETCH_CLIENTS_SUCCESS'
export const FETCH_CLIENTS_FAILURE = 'FETCH_CLIENTS_FAILURE'

//Update client
export const UPDATE_CLIENT = 'UPDATE_CLIENT'
export const UPDATE_CLIENT_SUCCESS = 'UPDATE_CLIENT_SUCCESS'
export const UPDATE_CLIENT_FAILURE = 'UPDATE_CLIENT_FAILURE'

export const fetchClientsRequest = () => {
  return {
    type: FETCH_CLIENTS
  }
}

export const fetchClientsSuccess = (clients) => {
  return {
    type: FETCH_CLIENTS_SUCCESS,
    payload: normalize(clients, clientListSchema),
    receivedAt: Date.now()
  }
}

export const fetchClientsFailure = (error) => {
  return {
    type: FETCH_CLIENTS_FAILURE,
    error: error
  }
}

export const fetchClients = (token, queryParams = {}) => {

  return (dispatch) => {

    dispatch(fetchClientsRequest())

    return clientsApi.getAllClients(token, queryParams).then(responseClients => {
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


export const createClientRequest = (payload) => {

  return {
    type: CREATE_CLIENT,
    payload
  }
}

export const createClientSuccess = (payload) => {
  return {
    type: CREATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload
  }
}

export const createClientError = (error) => {
  return {
    type: CREATE_CLIENT_FAILURE,
    error: 'Oops'
  }
}


export const createClient = (business, client, token) => {

  return (dispatch) => {

    dispatch(createClientRequest(client))

    return clientsApi.createClient(client, token).then(responseClient => {
          dispatch(createClientSuccess(responseClient))
          dispatch(push(`/${business.id}/clients/${responseClient.id}`))
          return responseClient
        }).catch(error => {
          throw(error)
        })
  }
}


export const updateClientRequest = (payload) => {

  return {
    type: UPDATE_CLIENT,
    payload
  }
}

export const updateClientSuccess = (payload) => {
  return {
    type: UPDATE_CLIENT_SUCCESS,
    receivedAt: Date.now(),
    payload
  }
}

export const updateClientError = (error) => {
  return {
    type: UPDATE_CLIENT_FAILURE,
    error: error
  }
}


export const updateClient = (client, token) => {

  return (dispatch) => {

    dispatch(createClientRequest(client))

    return clientsApi.updateClient(client, token).then(responseClient => {
      dispatch(updateClientSuccess(responseClient))
      return responseClient
    }).catch(error => {
      dispatch(updateClientError(error))
    })
  }
}
