import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import auth from './auth'
import nav from './nav'

const rootReducer = combineReducers({
  routing: routerReducer,
  form: reduxFormReducer,
  auth,
  nav
})

export default rootReducer
