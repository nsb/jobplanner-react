import { ONLINE, OFFLINE } from 'redux-queue-offline'

const initialState = {
  offline: !navigator.onLine || false
}

const NetworkReducer = (state = initialState, action) => {
  switch (action.type) {
    case ONLINE:
      return Object.assign({}, state, {
        offline: false
      })

    case OFFLINE:
      return Object.assign({}, state, {
        offline: true
      })

    default:
      return state
  }
}

export default NetworkReducer
