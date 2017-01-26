import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'
import nav from './nav'

const rootReducer = combineReducers({
  routing: routerReducer,
  auth,
  nav
})

export default rootReducer
