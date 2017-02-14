import { combineReducers } from 'redux'
import { merge } from 'lodash/object'
import { CREATE_BUSINESS_SUCCESS,
         FETCH_BUSINESSES,
         FETCH_BUSINESSES_SUCCESS,
         FETCH_BUSINESSES_FAILURE } from '../actions'

const isFetching = (state = false, action) => {
  switch (action.type) {
    case FETCH_BUSINESSES:
      return true

    case FETCH_BUSINESSES_SUCCESS:
      return false

    case FETCH_BUSINESSES_FAILURE:
      return false

    default:
      return state
  }
}

const businesses = (state = {}, action) => {
  switch (action.type) {
    case CREATE_BUSINESS_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload
        }
      }

    case 'UPDATE_BUSINESS':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      }

    case FETCH_BUSINESSES_SUCCESS:
      if (action.payload && action.payload.entities && action.payload.entities.businesses) {
        return merge({}, state, action.payload.entities.businesses)
      }
      return state

    default:
    return state
  }
}

const entities = combineReducers({
  businesses,
})

const result = (state = [], action) => {
  switch (action.type) {
    case CREATE_BUSINESS_SUCCESS:
      return [...state, action.payload.id]

    case FETCH_BUSINESSES_SUCCESS:
      if (action.payload && action.payload.result) {
        return merge({}, state, action.payload.result)
      }
      return state

    default:
      // if (action.payload && action.payload.result) {
      //   return merge({}, state, action.payload.result)
      // }
      return state
    }
}

export default combineReducers({
  isFetching,
  entities,
  result,
})

// import { CREATE_BUSINESS_SUCCESS,
//          FETCH_BUSINESSES,
//          FETCH_BUSINESSES_SUCCESS } from '../actions'
//
// const businessesReducer = (state = [], action) => {
//
//   switch (action.type) {
//     case CREATE_BUSINESS_SUCCESS:
//       return Object.assign(
//         {}, state, {
//           entities: Object.assign(
//             {}, state.entities, {
//               [action.result]: Object.assign(
//                 {}, action.payload.entities[action.result])})})
//       // return {
//       //   ...state,
//       //   [action.payload.id]: {
//       //     ...action.payload
//       //   }
//       // };
//       // const { items } = state
//       // return Object.assign({}, state, {
//       //   items: [
//       //     ...items.filter(business => business.id !== action.business.id),
//       //     Object.assign({}, action.business)
//       //   ]
//       // })
//
//     case FETCH_BUSINESSES:
//       return Object.assign({}, state, { isFetching: true })
//
//     case FETCH_BUSINESSES_SUCCESS:
//       return {...action.payload, isFetching: false }
//
//     default:
//       return state
//   }
// }
//
// export default businessesReducer
