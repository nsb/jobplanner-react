// @flow
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { intlReducer } from "react-intl-redux";
import { reducer as reduxFormReducer } from "redux-form";
import { optimistic } from "redux-optimistic-ui";
import auth from "./auth";
import nav from "./nav";
import businesses from "./businesses";
import clients from "./clients";
import network from "./network";
import users from "./users";
import jobs from "./jobs";
import visits from "./visits";
import entities from "./entities";

const reducers = {
  router: routerReducer,
  form: reduxFormReducer,
  intl: intlReducer,
  visits: optimistic(visits),
  auth,
  nav,
  businesses,
  clients,
  network,
  users,
  jobs,
  entities: optimistic(entities)
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
