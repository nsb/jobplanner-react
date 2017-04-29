// @flow
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux';
import {reducer as reduxFormReducer} from 'redux-form';
import auth from './auth';
import nav from './nav';
import businesses from './businesses';
import clients from './clients';
import network from './network';
import users from './users';
import jobs from './jobs';

const reducers = {
  routing: routerReducer,
  form: reduxFormReducer,
  intl: intlReducer,
  auth,
  nav,
  businesses,
  clients,
  network,
  users,
  jobs,
};

export type Reducers = typeof reducers;
export default combineReducers(reducers);
