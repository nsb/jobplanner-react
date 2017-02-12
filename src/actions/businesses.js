import { push } from 'react-router-redux'
import businessesApi from '../api/BusinessesApi'

//Create new business
export const CREATE_BUSINESS = 'CREATE_BUSINESS'
export const CREATE_BUSINESS_SUCCESS = 'CREATE_BUSINESS_SUCCESS'
export const CREATE_BUSINESS_FAILURE = 'CREATE_BUSINESS_FAILURE'
export const RESET_NEW_BUSINESS = 'RESET_NEW_BUSINESS'

//Fetch businesses
export const FETCH_BUSINESSES = 'FETCH_BUSINESSES'
export const FETCH_BUSINESSES_SUCCESS = 'FETCH_BUSINESSES_SUCCESS'
export const FETCH_BUSINESSES_FAILURE = 'FETCH_BUSINESSES_FAILURE'
export const RESET_BUSINESSES = 'RESET_BUSINESSES'

export const fetchBusinessesRequest = () => {
  return {
    type: FETCH_BUSINESSES
  }
}

export const fetchBusinessesSuccess = (businesses) => {
  return {
    type: FETCH_BUSINESSES_SUCCESS,
    businesses: businesses,
    receivedAt: Date.now()
  }
}

export const fetchBusinessesFailure = (error) => {
  return {
    type: FETCH_BUSINESSES_FAILURE,
    error: error
  }
}

export const fetchBusinesses = (token) => {

  return (dispatch) => {

    dispatch(fetchBusinessesRequest())

    return businessesApi.getAllBusinesses(token).then(responseBusinesses => {
          dispatch(fetchBusinessesSuccess(responseBusinesses))
          return responseBusinesses
        }).catch(error => {
          throw(error)
        })
  }
}


export const createBusinessRequest = (business) => {

  return {
    type: CREATE_BUSINESS,
    business
  }
}

export const createBusinessSuccess = (json) => {
  return {
    type: CREATE_BUSINESS_SUCCESS,
    business: json,
    receivedAt: Date.now()
  }
}

export const createBusinessError = (error) => {
  return {
    type: CREATE_BUSINESS_FAILURE,
    error: 'Oops'
  }
}


export const createBusiness = (data, token) => {

  return (dispatch) => {

    dispatch(createBusinessRequest(data))

    return businessesApi.createBusiness(data, token).then(responseBusiness => {
          dispatch(createBusinessSuccess(responseBusiness))
          dispatch(push(`/${responseBusiness.id}`))
          return responseBusiness
        }).catch(error => {
          throw(error)
        })

  }
}
