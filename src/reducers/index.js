import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import login from './login'
import nav from './nav'

const rootReducer = combineReducers({
  routing: routerReducer,
  login,
  nav
})

export default rootReducer
