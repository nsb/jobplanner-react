// @flow
import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { createStore, applyMiddleware } from "redux";
// import {Provider} from 'react-redux';
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
// import createHistory from 'history/createBrowserHistory';
import { Router } from "react-router-dom";
// import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
// import NetworkListener from 'redux-queue-offline-listener';
import { updateIntl, Provider } from "react-intl-redux";
import { addLocaleData } from "react-intl";
import history from "./history";
import en from "react-intl/locale-data/en";
import da from "react-intl/locale-data/da";
import type { Store } from "./types/Store";
import rootReducer from "./reducers";
import App from "./containers/App";
import "grommet/scss/vanilla/index.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "grommet-css";
import "./index.css";

import localeEnData from "./locales/en.json";
import localeDaData from "./locales/da.json";
addLocaleData([...en, ...da]);

const language =
  (navigator.languages && navigator.languages[0]) || navigator.language;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
let messages: Object;

// configure moment locale
moment.locale(language);

if (languageWithoutRegionCode === "da") {
  messages = localeDaData;
} else {
  messages = localeEnData;
}

// Setup service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function(registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        })
        .catch(function(err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        });
    }
  });
}

// const NetworkListenerProvider = NetworkListener(Provider);

// Create an enhanced history that syncs navigation events with the store
// const history = syncHistoryWithStore(browserHistory, store);
// const history = syncHistoryWithStore(createBrowserHistory(), store);
// const history = createHistory();

const middleware = [thunkMiddleware];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

// const initialState = {
//   intl: {
//     locale: languageWithoutRegionCode,
//     messages: messages,
//   },
//   // ...other initialState
// }

function configureStore(): Store {
  return createStore(
    rootReducer,
    // initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
}

const store = configureStore();

store.dispatch(
  updateIntl({
    locale: languageWithoutRegionCode,
    messages
  })
);

// const authRequired = (nextState: State) => {
//   if (!store.getState().auth.token) {
//     store.dispatch(push('/login'));
//   }
// };

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
