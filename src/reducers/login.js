const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return Object.assign({}, state, {
        busy: true
      })

    case 'REQUEST_LOGIN_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        busy: false
      })

    case 'REQUEST_LOGIN_FAILURE':
      return Object.assign({}, state, {
        busy: false
      })

    default:
      return state
  }
}

export default loginReducer
