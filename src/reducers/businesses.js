import { CREATE_BUSINESS_SUCCESS, FETCH_BUSINESSES_SUCCESS } from '../actions'

const businessesReducer = (state = [], action) => {

  switch (action.type) {
    case CREATE_BUSINESS_SUCCESS:
      return [
        ...state.filter(business => business.id !== action.business.id),
        Object.assign({}, action.business)
      ]

    case FETCH_BUSINESSES_SUCCESS:
      return action.businesses

    default:
      return state
  }
}

export default businessesReducer
