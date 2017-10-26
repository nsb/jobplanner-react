// @flow
import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { Router } from "react-router-dom";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { updateIntl, Provider } from "react-intl-redux";
import { addLocaleData } from "react-intl";
import StackdriverErrorReporter from './stackdriver';
import history from "./history";
import en from "react-intl/locale-data/en";
import da from "react-intl/locale-data/da";
import type { Store } from "./types/Store";
import rootReducer from "./reducers";
import App from "./containers/App";
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

// Set error reporting
const errorHandler = new StackdriverErrorReporter();

if (process.env.NODE_ENV === "production") {
  errorHandler.start({
    key: 'AIzaSyBGHOWXlPKZaQpvOv06CQRMtQYn7Bfzg9Y',
    projectId: 'jobplanner-184011',
    // service: '<my-service>',              // (optional)
    // version: '<my-service-version>',      // (optional)
    // reportUncaughtExceptions: false    // (optional) Set to false to stop reporting unhandled exceptions.
    // disabled: true                     // (optional) Set to true to not report errors when calling report(), this can be used when developping locally.
    // context: {user: 'user1'}           // (optional) You can set the user later using setUser()
  });
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
