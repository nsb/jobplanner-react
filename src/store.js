import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

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
    (state, action) => {
      if (action.type === "LOGOUT") {
        state = undefined;
      }

      return rootReducer(state, action);
    },
    // initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
}

export default configureStore();
