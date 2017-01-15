import fetch from 'isomorphic-fetch'

const TOGGLE_NAV = 'TOGGLE_NAV'
const REQUEST_LOGIN = 'REQUEST_LOGIN'
const REQUEST_LOGIN_FAILURE = 'REQUEST_LOGIN_FAILURE'
const REQUEST_LOGIN_SUCCESS = 'REQUEST_LOGIN_SUCCESS'

export const toggleNav = () => {
  return {
    type: TOGGLE_NAV
  }
}

export const requestLogin = (credentials) => {
  const { username, password, rememberMe } = credentials

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
    token: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export const receiveLoginError = (json) => {
  return {
    type: REQUEST_LOGIN_FAILURE,
    error: 'Oops'
  }
}


export const login = (credentials) => {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch) => {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestLogin(credentials))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('http://localhost:8000/api-token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(...credentials)
    }).then(response => response.json())
      .then(json =>

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveLogin(json))
      )

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}
