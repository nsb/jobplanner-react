import { CREATE_BUSINESS_SUCCESS,
         FETCH_BUSINESSES,
         FETCH_BUSINESSES_SUCCESS } from '../actions'

const businessesReducer = (state = [], action) => {

  switch (action.type) {
    case CREATE_BUSINESS_SUCCESS:
      const { items } = state
      return Object.assign({}, state, {
        items: [
          ...items.filter(business => business.id !== action.business.id),
          Object.assign({}, action.business)
        ]
      })

    case FETCH_BUSINESSES:
      return Object.assign({}, state, { isFetching: true })

    case FETCH_BUSINESSES_SUCCESS:
      return Object.assign({}, state, {
        items: action.businesses,
        isFetching: false
      })

    default:
      return state
  }
}

export default businessesReducer
