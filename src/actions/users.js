import usersApi from '../api/UsersApi'

const REQUEST_ME = 'REQUEST_ME'
const REQUEST_ME_FAILURE = 'REQUEST_ME_FAILURE'
const REQUEST_ME_SUCCESS = 'REQUEST_ME_SUCCESS'


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
      dispatch(receiveMe(responseUser))
      return responseUser
    }).catch(error => {
      throw(error)
    })
  }
}
