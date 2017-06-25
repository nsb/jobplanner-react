// @flow
import { merge } from "lodash/object";
import type { Action as ClientsAction, ClientsMap } from "../actions/clients";
import type { PropertiesMap } from "../actions/properties";

type ClientsState = ClientsMap;
type PropertiesState = PropertiesMap;

export type State = {
  clients: ClientsState,
  properties: PropertiesState
};

type Action = ClientsAction;

// Updates an entity cache in response to any action with entities.
const entities = (
  state: State = { clients: {}, properties: {} },
  action: Action
): State => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};

export default entities;
