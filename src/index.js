// @flow
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import moment from "moment";
import posthog from "posthog-js";
import "moment/locale/da";
import * as Sentry from "@sentry/browser";
import { Router } from "react-router-dom";
import "core-js/fn/array/flat-map"; // Edge browser does not have flat-map
import { addLocaleData } from "react-intl";
import { configureFlashMessages } from "redux-flash-messages";
import browserUpdate from "browser-update";
import history from "./history";
import en from "react-intl/locale-data/en";
import da from "react-intl/locale-data/da";
import store from "./store";
import { AuthProvider } from "./providers/authProvider";
import App from "./containers/App";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "nielsbusch-grommet-css";
import "./index.css";
import localeEnData from "./locales/en.json";
import localeDaData from "./locales/da.json";

browserUpdate({ required: { i: 999, f: -6, o: -6, s: -3, c: -6 } });

addLocaleData([...en, ...da]);

const language =
  (navigator.languages && navigator.languages[0]) || navigator.language;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
let messages: Object;

// configure drift
if (window.drift) {
  window.drift.config({
    locale: languageWithoutRegionCode,
  });
  window.drift.load("fk4gftg5k9zk");
}

// configure posthog
window.location.href.indexOf("localhost") === -1 &&
  posthog.init("UiU9EFVUJIhvAAs0P8OPHq3KJfeTdoSqLCGeg7NjNew", {
    api_host: "https://app.posthog.com",
  });

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
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_PUBLIC_DSN,
    release: process.env.COMMIT_REF || "unknown",
    environment: process.env.NODE_ENV || "unknown",
    send_default_pii: true,
  });
}

// const NetworkListenerProvider = NetworkListener(Provider);

// Create an enhanced history that syncs navigation events with the store
// const history = syncHistoryWithStore(browserHistory, store);
// const history = syncHistoryWithStore(createBrowserHistory(), store);
// const history = createHistory();

configureFlashMessages({
  // The dispatch function for the Redux store.
  dispatch: store.dispatch,
});

const root = document.getElementById("root");
if (root) {
  ReactDOM.render(
    <Provider store={store}>
      <AuthProvider>
        <IntlProvider locale={languageWithoutRegionCode} messages={messages}>
          <Router history={history}>
            <App />
          </Router>
        </IntlProvider>
      </AuthProvider>
    </Provider>,
    root
  );
}
