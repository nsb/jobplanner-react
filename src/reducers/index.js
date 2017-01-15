import { combineReducers } from 'redux'
import ui from './ui'
import login from './login'

const jobplannerApp = combineReducers({
  ui, login
})

export default jobplannerApp
