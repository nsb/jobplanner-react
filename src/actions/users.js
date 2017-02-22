import { push } from 'react-router-redux'
import usersApi from '../api/UsersApi'

export const REQUEST_ME = 'REQUEST_ME'
export const REQUEST_ME_FAILURE = 'REQUEST_ME_FAILURE'
export const REQUEST_ME_SUCCESS = 'REQUEST_ME_SUCCESS'


export const requestMe = (token) => {

  return {
    type: REQUEST_ME,
    token
  }
}

export const receiveMe = (user) => {
  return {
    type: REQUEST_ME_SUCCESS,
    receivedAt: Date.now(),
    user
  }
}

export const receiveMeError = (error) => {
  return {
    type: REQUEST_ME_FAILURE,
    error: 'Oops'
  }
}


export const me = (token) => {

  return (dispatch) => {

    dispatch(requestMe(token))

    return usersApi.getMe(token).then(responseUser => {
      if (responseUser.id) {
        dispatch(receiveMe(responseUser))
      } else {
        dispatch(receiveMeError(responseUser))
        dispatch(push('/login'))
      }
      return responseUser
    }).catch(error => {
      throw(error)
    })
  }
}
