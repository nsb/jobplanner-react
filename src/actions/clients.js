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
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch) => {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(createClientRequest(client))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.


    return clientsApi.createClient(client, token).then(responseClient => {
          dispatch(createClientSuccess(responseClient))
          dispatch(push(`/clients/${responseClient.id}`))
          return responseClient
        }).catch(error => {
          throw(error);
        });

  }
}
