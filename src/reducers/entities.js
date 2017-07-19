// @flow
import { merge } from "lodash/object";
import type {
  Action as BusinessesAction,
  BusinessesMap
} from "../actions/businesses";
import type { Action as ClientsAction, ClientsMap } from "../actions/clients";
import type { PropertiesMap } from "../actions/properties";
import type { Action as JobsAction, JobsMap } from "../actions/jobs";
import type { Action as VisitsAction, VisitsMap } from "../actions/visits";

type BusinessState = BusinessesMap;
type ClientsState = ClientsMap;
type PropertiesState = PropertiesMap;
type JobsState = JobsMap;
type VisitsState = VisitsMap;

export type State = {
  businesses: BusinessState,
  clients: ClientsState,
  properties: PropertiesState,
  jobs: JobsState,
  visits: VisitsState
};

type Action = BusinessesAction | ClientsAction | JobsAction | VisitsAction;

// Updates an entity cache in response to any action with entities.
const entities = (
  state: State = { businesses: {}, clients: {}, properties: {}, jobs: {}, visits: {} },
  action: Action
): State => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};

export default entities;
