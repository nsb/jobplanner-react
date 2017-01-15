import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'

const TOGGLE_NAV = 'TOGGLE_NAV'
const REQUEST_LOGIN = 'REQUEST_LOGIN'
const REQUEST_LOGIN_FAILURE = 'REQUEST_LOGIN_FAILURE'
const REQUEST_LOGIN_SUCCESS = 'REQUEST_LOGIN_SUCCESS'

export const toggleNav = () => {
  return {
    type: TOGGLE_NAV
  }
}

export const requestLogin = (username, password, rememberMe) => {

  return {
    type: REQUEST_LOGIN,
    username,
    password,
    rememberMe
  }
}

export const receiveLogin = (json) => {
  return {
    type: REQUEST_LOGIN_SUCCESS,
    token: json.token,
    receivedAt: Date.now()
  }
}

export const receiveLoginError = (error) => {
  return {
    type: REQUEST_LOGIN_FAILURE,
    error: 'Oops'
  }
}


export const login = (credentials) => {
  const { username, password, rememberMe } = credentials
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch) => {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestLogin(username, password, rememberMe))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('http://localhost:8000/api-token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(response => response.json())
      .then(json => {

        if (json.token) {
          dispatch(receiveLogin(json))
          dispatch(push('/foo'))
        } else {
          dispatch(receiveLoginError(json))
        }

      }).catch((error) =>
        dispatch(receiveLoginError(error))
      )
  }
}
