// @flow
import { combineReducers } from "redux";
// import { routerReducer } from "react-router-redux";
import { intlReducer } from "react-intl-redux";
import { reducer as reduxFormReducer } from "redux-form";
import { optimistic } from "redux-optimistic-ui";
import { flashMessage } from 'redux-flash-messages';
import auth from "./auth";
import nav from "./nav";
import businesses from "./businesses";
import services from "./services";
import employees from "./employees";
import clients from "./clients";
import properties from "./properties";
import network from "./network";
import users from "./users";
import jobs from "./jobs";
import visits from "./visits";
import asyncTasks from "./asynctasks";
import entities from "./entities";

const reducers = {
  // router: routerReducer,
  form: reduxFormReducer,
  intl: intlReducer,
  visits: optimistic(visits),
  auth,
  nav,
  businesses,
  services,
  employees,
  clients,
  properties,
  network,
  users,
  jobs,
  asyncTasks,
  flashMessage,
  entities: optimistic(entities)
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
