import { push } from 'react-router-redux'
import clientsApi from '../api/ClientsApi'

//Create new client
export const CREATE_CLIENT = 'CREATE_CLIENT';
export const CREATE_CLIENT_SUCCESS = 'CREATE_CLIENT_SUCCESS';
export const CREATE_CLIENT_FAILURE = 'CREATE_CLIENT_FAILURE';
export const RESET_NEW_CLIENT = 'RESET_NEW_CLIENT';

export const createClientRequest = (client) => {

  return {
    type: CREATE_CLIENT,
    client
  }
}

export const createClientSuccess = (json) => {
  return {
    type: CREATE_CLIENT_SUCCESS,
    client: json,
    receivedAt: Date.now()
  }
}

export const createClientError = (error) => {
  return {
    type: CREATE_CLIENT_FAILURE,
    error: 'Oops'
  }
}


export const createClient = (client, token) => {

  return (dispatch) => {

    dispatch(createClientRequest(client))

    return clientsApi.createClient(client, token).then(responseClient => {
          dispatch(createClientSuccess(responseClient))
          dispatch(push(`/clients/${responseClient.id}`))
          return responseClient
        }).catch(error => {
          throw(error)
        })
  }
}
