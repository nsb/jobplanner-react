import { NAV_ACTIVE, NAV_TOGGLE } from '../actions'

const navReducer = (state = {}, action) => {
  switch (action.type) {
    case NAV_ACTIVE:
      return Object.assign({}, state, {
        active: action.active
      })

    case NAV_TOGGLE:
      return Object.assign({}, state, {
        active: !state.active
      })

    default:
      return state
  }
}

export default navReducer
