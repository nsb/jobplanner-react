import { merge } from "lodash/object";
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
import type { Action as FieldsAction, FieldsMap } from "../actions/fields";
import type {
  Action as EmployeesAction,
  EmployeesMap
} from "../actions/employees";
import type { LineItemsMap } from "../actions/lineitems";
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
  asyncTasks: AsyncTaskState,
  invoices: InvoicesState
};

type Action =
  | BusinessesAction
  | ClientsAction
  | PropertiesAction
  | JobsAction
  | VisitsAction
  | ServicesAction
  | FieldsAction
  | EmployeesAction
  | AsyncTasksAction
  | InvoicesAction;

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
    asyncTasks: {},
    invoices: {}
  },
  action: Action
): State => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};

export default entities;
