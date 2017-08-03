import {BEGIN, COMMIT, REVERT} from 'redux-optimistic-ui';

//All my redux action types that are optimistic have the following suffixes, yours may vary
const _SUCCESS = '_SUCCESS';
const _FAILURE = '_FAILURE';

//Each optimistic item will need a transaction Id to internally match the BEGIN to the COMMIT/REVERT
let nextTransactionID = 0;

// That crazy redux middleware that's 3 functions deep!
const optimisticMiddleware = store => next => action => {
  // FSA compliant
  const {type, meta, payload} = action;

  // For actions that have a high probability of failing, I don't set the flag
  if (!meta || !meta.isOptimistic) return next(action);

  // Now that we know we're optimistically updating the item, give it an ID
  let transactionID = nextTransactionID++;

  // Extend the action.meta to let it know we're beginning an optimistic update
  next(Object.assign({}, action, {meta: {optimistic: {type: BEGIN, id: transactionID}}}));

  const error = true
  // HTTP is boring, I like sending data over sockets, the 3rd arg is a callback
  // socket.emit(type, payload, error => {
    // Create a redux action based on the result of the callback
  next({
    type: type + (error ? _FAILURE : _SUCCESS),
    error,
    payload,
    meta: {
      //Here's the magic: if there was an error, revert the state, otherwise, commit it
      optimistic: error ? {type: REVERT, id: transactionID} : {type: COMMIT, id: transactionID}
    }
  });
  // })
};

export { optimisticMiddleware }
