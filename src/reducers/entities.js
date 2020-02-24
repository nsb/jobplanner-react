// @flow

import { merge } from "lodash/object";
import { combineReducers } from "redux";
import { FETCH_JOBS_SUCCESS } from "../actions/jobs";
import type {
  Action as BusinessesAction,
  BusinessesMap
} from "../actions/businesses";
import type { Action as ClientsAction, ClientsMap } from "../actions/clients";
import type { PropertiesMap } from "../actions/properties";
import type { Action as JobsAction, JobsMap } from "../actions/jobs";
import type { Action as VisitsAction, VisitsMap } from "../actions/visits";
import type {
  Action as ServicesAction,
  ServicesMap
} from "../actions/services";
import type { Action as FieldsAction, FieldsMap } from "../actions/fields";
import type {
  Action as EmployeesAction,
  EmployeesMap
} from "../actions/employees";
import type { LineItemsMap } from "../actions/lineitems";
import type { LineItemOverridesMap } from "../actions/lineitemoverrides";
import type {
  Action as AsyncTasksAction,
  AsyncTasksMap
} from "../actions/asynctasks";
import type {
  Action as InvoicesAction,
  InvoicesMap
} from "../actions/invoices";

type BusinessState = BusinessesMap;
type ClientsState = ClientsMap;
type PropertiesState = PropertiesMap;
type JobsState = JobsMap;
type VisitsState = VisitsMap;
type ServicesState = ServicesMap;
type FieldsState = FieldsMap;
type EmployeesState = EmployeesMap;
type LineItemsState = LineItemsMap;
type LineItemOverridesState = LineItemOverridesMap;
type AsyncTaskState = AsyncTasksMap;
type InvoicesState = InvoicesMap;

export type State = {
  businesses: BusinessState,
  clients: ClientsState,
  properties: PropertiesState,
  jobs: JobsState,
  visits: VisitsState,
  services: ServicesState,
  fields: FieldsState,
  employees: EmployeesState,
  lineItems: LineItemsState,
  lineItemOverrides: LineItemOverridesState,
  asyncTasks: AsyncTaskState,
  invoices: InvoicesState
};

type Action =
  | BusinessesAction
  | ClientsAction
  | JobsAction
  | VisitsAction
  | ServicesAction
  | FieldsAction
  | EmployeesAction
  | AsyncTasksAction
  | InvoicesAction;

const jobsReducer: (JobsMap, Action) => JobsMap = (
  state: JobsMap = {},
  action: Action
): JobsMap => {
  if (action.type === FETCH_JOBS_SUCCESS) {
    for (let [jobId, job] of Object.entries(
      action.payload.entities.jobs || {}
    )) {
      // $FlowFixMe Flow bug see https://github.com/facebook/flow/issues/5838
      state[jobId].visits = job.visits;
    }
  }
  return state;
};

const identityReducer = (state = {}, action) => state;

// Updates an entity cache in response to any action with entities.
const entities: (State, Action) => State = (
  state: State = {
    businesses: {},
    clients: {},
    properties: {},
    jobs: {},
    visits: {},
    services: {},
    fields: {},
    employees: {},
    lineItems: {},
    lineItemOverrides: {},
    asyncTasks: {},
    invoices: {}
  },
  action: Action
): State => {
  let newState = state;
  if (action.payload && action.payload.entities) {
    newState = merge({}, state, action.payload.entities);
  }

  return combineReducers({
    businesses: identityReducer,
    clients: identityReducer,
    properties: identityReducer,
    jobs: jobsReducer,
    visits: identityReducer,
    services: identityReducer,
    fields: identityReducer,
    employees: identityReducer,
    lineItems: identityReducer,
    asyncTasks: identityReducer,
    invoices: identityReducer
  })(newState, action);
};

export default entities;
