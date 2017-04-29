// @flow
import { ONLINE, OFFLINE } from 'redux-queue-offline'

type State = {
  offline: boolean
}

type OnlineAction = {
  type: 'ONLINE'
}

type OfflineAction = {
  type: 'OFFLINE'
}

type Action =
  | OnlineAction
  | OfflineAction

const initialState: State = {
  offline: !navigator.onLine || false
}

const NetworkReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'ONLINE':
      return Object.assign({}, state, {
        offline: false
      })

    case 'OFFLINE':
      return Object.assign({}, state, {
        offline: true
      })

    default:
      return state
  }
}

export default NetworkReducer
