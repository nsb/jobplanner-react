import { NAV_ACTIVE, NAV_TOGGLE, NAV_RESPONSIVE } from '../actions'

const initialState = {
  active: true, responsive: 'multiple'
}

const navReducer = (state = initialState, action) => {
  switch (action.type) {
    case NAV_ACTIVE:
      return Object.assign({}, state, {
        active: action.active
      })

    case NAV_TOGGLE:
      return Object.assign({}, state, {
        active: !state.active
      })

    case NAV_RESPONSIVE:
      return { ...state,
               responsive: action.responsive,
               active: action.responsive === 'multiple' }

    default:
      return state
  }
}

export default navReducer
