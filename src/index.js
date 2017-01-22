import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
// import { routes } from './routes';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import rootReducer from './reducers'
import App from './containers/App'
import AppAuthenticated from './containers/AppAuthenticated'
import Test from './components/Test'
import Login from './components/Login'
import './index.css';
import 'grommet/scss/vanilla/index.scss';

const middleware = [ thunkMiddleware, routerMiddleware(browserHistory) ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(
  rootReducer,
  { login: {busy: false}, nav: {enabled: true, active: true}},
  applyMiddleware(...middleware)
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} >
      <Route path="/" component={App}>

        <Route component={AppAuthenticated}>
          <IndexRoute component={Test}/>
        </Route>

        <Route path="login" component={Login}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
