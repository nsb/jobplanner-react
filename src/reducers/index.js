import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import ui from './ui'
import login from './login'

const rootReducer = combineReducers({
  routing: routerReducer,
  ui,
  login
})

export default rootReducer
