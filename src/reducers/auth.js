const authReducer = (state = {}, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return Object.assign({}, state, {
        busy: true
      })

    case 'REQUEST_LOGIN_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        user: action.user,
        busy: false,
        isAuthenticated: true
      })

    case 'REQUEST_LOGIN_FAILURE':
      return Object.assign({}, state, {
        busy: false
      })

    case 'REQUEST_VERIFY':
      return Object.assign({}, state, {
        busy: true
      })

    case 'REQUEST_VERIFY_SUCCESS':
      return Object.assign({}, state, {
        isAuthenticated: true,
        user: action.user,
        busy: false
      })

    case 'REQUEST_VERIFY_FAILURE':
      return Object.assign({}, state, {
        isAuthenticated: false,
        user: null,
        busy: false
      })

    case 'LOGOUT':
      return Object.assign({}, state, {
        token: null
      })


    default:
      return state
  }
}

export default authReducer
