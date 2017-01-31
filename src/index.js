import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux'
import rootReducer from './reducers'
import App from './containers/App'
import AppAuthenticated from './containers/AppAuthenticated'
import AppAuthenticatedSearch from './containers/AppAuthenticatedSearch'
import Test from './components/Test'
import Login from './components/Login'
import 'grommet/scss/vanilla/index.scss';
import './index.css';

// Setup service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

const middleware = [ thunkMiddleware, routerMiddleware(browserHistory) ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const token = localStorage.getItem('token');

const store = createStore(
  rootReducer,
  { auth: { busy: false, token: token, user: null, isAuthenticated: false },
    nav: { active: true, responsive: 'multiple' } },
  applyMiddleware(...middleware)
)

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

        <Route onEnter={authRequired} component={AppAuthenticated} >
          <Route component={AppAuthenticatedSearch}>
            <IndexRoute component={Test}/>
          </Route>
        </Route>

        <Route path="login" component={Login}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
