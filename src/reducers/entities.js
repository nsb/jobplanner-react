// @flow
import { merge, assign } from "lodash/object";
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
  state: State = {
    businesses: {},
    clients: {},
    properties: {},
    jobs: {},
    visits: {},
    services: {},
    employees: {},
    lineItems: {}
  },
  action: Action
): State => {
  // when updating merging does not work. Instead we assign the updated entity
  if (action.type && action.type.match(/^UPDATE_[A-Z]+_SUCCESS/)) {
    let newState = { ...state };
    if (action.payload && action.payload.entities) {
      for (var entity of Object.keys(action.payload.entities)) {
        for (var id of Object.keys(action.payload.entities[entity])) {
          try {
            newState[entity][id] = assign(
              {},
              action.payload.entities[entity][id]
            );
          } catch (e) {
            if (e instanceof TypeError) {
              newState[entity] = assign(
                {}[id],
                action.payload.entities[entity][id]
              );
            }
          }
        }
      }
      return newState;
    }
  } else {
    if (action.payload && action.payload.entities) {
      return merge({}, state, action.payload.entities);
    }
  }

  return state;
};

export default entities;
