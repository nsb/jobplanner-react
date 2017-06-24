// @flow
import {merge} from 'lodash/object';
import type {Action as ClientsAction, ClientsMap} from '../actions/clients';

type ClientsState = ClientsMap;
export type State = {
  clients: ClientsState
}

type Action =
  | ClientsAction

// Updates an entity cache in response to any action with entities.
const entities = (state: State = { clients: {} }, action: Action): State => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities)
  }

  return state
}

export default entities;
