import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import auth from './auth'
import nav from './nav'
import businesses from './businesses'
import clients from './clients'

const rootReducer = combineReducers({
  routing: routerReducer,
  form: reduxFormReducer,
  auth,
  nav,
  businesses,
  clients
})

export default rootReducer
