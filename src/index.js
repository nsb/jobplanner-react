// @flow
import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import "moment/locale/da";
import Raven from "raven-js";
import { Router } from "react-router-dom";
import { updateIntl, Provider } from "react-intl-redux";
import { addLocaleData } from "react-intl";
import { configureFlashMessages } from "redux-flash-messages";
import history from "./history";
import en from "react-intl/locale-data/en";
import da from "react-intl/locale-data/da";
import store from "./store";
import App from "./containers/App";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "nielsbusch-grommet-css";
import "./index.css";
import localeEnData from "./locales/en.json";
import localeDaData from "./locales/da.json";
addLocaleData([...en, ...da]);

const language =
  (navigator.languages && navigator.languages[0]) || navigator.language;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
let messages: Object;

// configure moment locale, with Monday as 1st day of week
moment.locale(language, {
  week: {
    dow: 1,
    doy: 1,
  },
});

if (languageWithoutRegionCode === "da") {
  messages = localeDaData;
} else {
  messages = localeEnData;
}

if (process.env.REACT_APP_SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.REACT_APP_SENTRY_PUBLIC_DSN, {
    release: process.env.COMMIT_REF || 'unknown',
    environment: process.env.NODE_ENV || 'unknown',
  }).install();
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

store.dispatch(
  updateIntl({
    locale: languageWithoutRegionCode,
    messages
  })
);

configureFlashMessages({
  // The dispatch function for the Redux store.
  dispatch: store.dispatch
});

const root = document.getElementById("root");
if (root) {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    root
  );
}
