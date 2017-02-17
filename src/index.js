import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import rootReducer from './reducers'
import App from './containers/App'
import AppAuthenticated from './containers/AppAuthenticated'
import AppAuthenticatedNav from './containers/AppAuthenticatedNav'
import Businesses from './components/Businesses'
import BusinessAdd from './components/BusinessAdd'
import Clients from './components/Clients'
import ClientAdd from './components/ClientAdd'
import Login from './components/Login'
import 'grommet/scss/vanilla/index.scss'
import './index.css'

// Setup service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err)
    })
  })
}

const middleware = [ thunkMiddleware, routerMiddleware(browserHistory) ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
))

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

const authRequired = (nextState, replace) => {
  if (!store.getState().auth.token) {
    store.dispatch(push('/login'))
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
      <Route path="/" component={App}>

        <Route path="login" component={Login} />

        <Route onEnter={authRequired} component={AppAuthenticated} >
          <IndexRoute component={Businesses}/>
          <Route path="add" component={BusinessAdd} />
          <Route path=":businessId" component={AppAuthenticatedNav} >
            <IndexRoute component={Clients}/>
            <Route path="clients" component={Clients} />
            <Route path="clients/add" component={ClientAdd} />
          </Route>
        </Route>

      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
