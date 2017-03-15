import { push } from 'react-router-redux'
import { normalize } from 'normalizr'
import { businessListSchema } from '../schemas'
import businessesApi from '../api'

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
    payload: normalize(businesses, businessListSchema),
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

    return businessesApi.getAll('businesses', token).then(responseBusinesses => {
      if (Array.isArray(responseBusinesses)) {
        dispatch(fetchBusinessesSuccess(responseBusinesses))
      } else {
        dispatch(fetchBusinessesFailure(responseBusinesses))
      }
      return responseBusinesses
    }).catch(error => {
      throw(error)
    })
  }
}


export const createBusinessRequest = (payload) => {

  return {
    type: CREATE_BUSINESS,
    payload
  }
}

export const createBusinessSuccess = (payload) => {
  return {
    type: CREATE_BUSINESS_SUCCESS,
    receivedAt: Date.now(),
    payload
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

    return businessesApi.create('businesses', data, token).then(responseBusiness => {
      if (responseBusiness.id) {
        dispatch(createBusinessSuccess(responseBusiness))
        dispatch(push(`/${responseBusiness.id}`))
      } else {
        dispatch(createBusinessError(responseBusiness))
      }
      return responseBusiness
    }).catch(error => {
      throw(error)
    })
  }
}
