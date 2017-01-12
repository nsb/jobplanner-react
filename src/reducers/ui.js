const uiReducer = (state = {}, action) => {
  switch (action.type) {
    case 'TOGGLE_NAV':
      return Object.assign({}, state, {
        showNav: !state.showNav
      })

    default:
      return state
  }
}

export default uiReducer
