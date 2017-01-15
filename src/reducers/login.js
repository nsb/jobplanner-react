const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return Object.assign({}, state, {
        loginBusy: true
      })

    case 'REQUEST_LOGIN_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        loginBusy: false
      })

    case 'REQUEST_LOGIN_FAILURE':
      return Object.assign({}, state, {
        loginBusy: false
      })

    default:
      return state
  }
}

export default loginReducer
