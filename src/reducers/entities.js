// @flow
import { merge } from "lodash/object";
import type { Action as ClientsAction, ClientsMap } from "../actions/clients";
import type { PropertiesMap } from "../actions/properties";
import type { Action as JobsAction, JobsMap } from "../actions/jobs";

type ClientsState = ClientsMap;
type PropertiesState = PropertiesMap;
type JobsState = JobsMap;

export type State = {
  clients: ClientsState,
  properties: PropertiesState,
  jobs: JobsState
};

type Action = ClientsAction | JobsAction;

// Updates an entity cache in response to any action with entities.
const entities = (
  state: State = { clients: {}, properties: {}, jobs: {} },
  action: Action
): State => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};

export default entities;
