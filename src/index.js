import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import NetworkListener from 'redux-queue-offline-listener'
import { Provider } from 'react-intl-redux'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import da from 'react-intl/locale-data/da'
import rootReducer from './reducers'
import App from './containers/App'
import AppAuthenticated from './containers/AppAuthenticated'
import AppAuthenticatedNav from './containers/AppAuthenticatedNav'
import Businesses from './components/Businesses'
import BusinessAdd from './components/BusinessAdd'
import Clients from './components/Clients'
import ClientAdd from './components/ClientAdd'
import ClientEdit from './components/ClientEdit'
import Jobs from './components/Jobs'
import JobsAdd from './components/JobsAdd'
import JobEdit from './components/JobEdit'
import Login from './components/Login'
import 'grommet/scss/vanilla/index.scss'
import './index.css'

import localeEnData from './locales/en.json'
import localeDaData from './locales/da.json'
addLocaleData([...en, ...da])

const language = (navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]
let messages = localeEnData

if (languageWithoutRegionCode === 'da') {
  messages = localeDaData
} else {
  messages = localeEnData
}

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

const NetworkListenerProvider = NetworkListener(Provider)

const middleware = [ thunkMiddleware, routerMiddleware(browserHistory) ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}


const initialState = {
  intl: {
    locale: 'da',
    messages: {
      'app.greeting': 'Hejsa {name}!',
    },
  },
  // ...other initialState
}

const store = createStore(
  rootReducer,
  initialState,
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
  <NetworkListenerProvider store={store} locale={language} messages={messages}>
    <Router history={history} >
      <Route path="/" component={App}>

        <Route path="login" component={Login} />

        <Route onEnter={authRequired} component={AppAuthenticated} >
          <IndexRoute component={Businesses}/>
          <Route path="add" component={BusinessAdd} />
          <Route path=":businessId" component={AppAuthenticatedNav} >
            <Route path="clients" component={Clients} />
            <Route path="clients/add" component={ClientAdd} />
            <Route path="clients/:clientId" component={ClientEdit} />
            <Route path="jobs" component={Jobs} />
            <Route path="jobs/add" component={JobsAdd} />
            <Route path="jobs/:jobId" component={JobEdit} />
            <IndexRoute component={Clients}/>
          </Route>
        </Route>

      </Route>
    </Router>
  </NetworkListenerProvider>,
  document.getElementById('root')
)
