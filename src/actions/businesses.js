import fetch from 'isomorphic-fetch'
import { push } from 'react-router-redux'

//Create new client
export const CREATE_BUSINESS = 'CREATE_BUSINESS';
export const CREATE_BUSINESS_SUCCESS = 'CREATE_BUSINESS_SUCCESS';
export const CREATE_BUSINESS_FAILURE = 'CREATE_BUSINESS_FAILURE';
export const RESET_NEW_BUSINESS = 'RESET_NEW_BUSINESS';

export const createBusinessRequest = (business) => {

  return {
    type: CREATE_BUSINESS,
    business
  }
}

export const createBusinessSuccess = (json) => {
  return {
    type: CREATE_BUSINESS_SUCCESS,
    business: json,
    receivedAt: Date.now()
  }
}

export const createBusinessError = (error) => {
  return {
    type: CREATE_BUSINESS_FAILURE,
    error: 'Oops'
  }
}


export const createBusiness = (data, token) => {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return (dispatch) => {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(createBusinessRequest(data))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch('http://localhost:8000/businesses/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        dispatch(createBusinessError('Oops'))
      }
    }).then(json => {
          dispatch(createBusinessSuccess(json))
          dispatch(push(`/${json.id}`))
      }).catch((error) =>
        dispatch(createBusinessError(error))
      )
  }
}
