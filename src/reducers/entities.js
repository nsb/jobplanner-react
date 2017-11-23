import { merge, assign } from "lodash/object";
import type {
  Action as BusinessesAction,
  BusinessesMap
} from "../actions/businesses";
import type { Action as ClientsAction, ClientsMap } from "../actions/clients";
import type {
  Action as PropertiesAction,
  PropertiesMap
} from "../actions/properties";
import type { Action as JobsAction, JobsMap } from "../actions/jobs";
import type { Action as VisitsAction, VisitsMap } from "../actions/visits";
import type {
  Action as ServicesAction,
  ServicesMap
} from "../actions/services";
import type {
  Action as EmployeesAction,
  EmployeesMap
} from "../actions/employees";
import type { LineItemsMap } from "../actions/lineitems";
import type {
  Action as AsyncTasksAction,
  AsyncTasksMap
} from "../actions/asynctasks";

type BusinessState = BusinessesMap;
type ClientsState = ClientsMap;
type PropertiesState = PropertiesMap;
type JobsState = JobsMap;
type VisitsState = VisitsMap;
type ServicesState = ServicesMap;
type EmployeesState = EmployeesMap;
type LineItemsState = LineItemsMap;
type AsyncTaskState = AsyncTasksMap;

export type State = {
  businesses: BusinessState,
  clients: ClientsState,
  properties: PropertiesState,
  jobs: JobsState,
  visits: VisitsState,
  services: ServicesState,
  employees: EmployeesState,
  lineItems: LineItemsState,
  asyncTasks: AsyncTaskState
};

type Action =
  | BusinessesAction
  | ClientsAction
  | PropertiesAction
  | JobsAction
  | VisitsAction
  | ServicesAction
  | EmployeesAction
  | AsyncTasksAction;

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
    lineItems: {},
    asyncTasks: {}
  },
  action: Action
): State => {
  // when updating, merging does not work. Instead we assign the updated entity
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
