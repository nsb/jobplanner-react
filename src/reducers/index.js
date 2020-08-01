// @flow
import { combineReducers } from "redux";
// import { routerReducer } from "react-router-redux";
import { reducer as reduxFormReducer } from "redux-form";
import { optimistic } from "redux-optimistic-ui";
import { flashMessage } from "redux-flash-messages";
import nav from "./nav";
import businesses from "./businesses";
import services from "./services";
import fields from "./fields";
import employees from "./employees";
import clients from "./clients";
import properties from "./properties";
import network from "./network";
import users from "./users";
import jobs from "./jobs";
import visits from "./visits";
import asyncTasks from "./asynctasks";
import entities from "./entities";
import invoices from "./invoices";
import hooks from "./hooks";

const reducers = {
  // router: routerReducer,
  form: reduxFormReducer,
  visits: optimistic(visits),
  nav,
  businesses,
  services,
  fields,
  employees,
  clients,
  properties,
  network,
  users,
  jobs,
  asyncTasks,
  flashMessage,
  entities: optimistic(entities),
  invoices,
  hooks,
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
