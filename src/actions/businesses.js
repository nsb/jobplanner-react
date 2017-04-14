import { push } from 'react-router-redux'
import { normalize } from 'normalizr'
import { businessListSchema } from '../schemas'
import businessesApi from '../api'
import type { Dispatch } from '../types/Store'

//Create new business
export const CREATE_BUSINESS: 'CREATE_BUSINESS' = 'CREATE_BUSINESS'
export const CREATE_BUSINESS_SUCCESS: 'CREATE_BUSINESS_SUCCESS' = 'CREATE_BUSINESS_SUCCESS'
export const CREATE_BUSINESS_FAILURE: 'CREATE_BUSINESS_FAILURE' = 'CREATE_BUSINESS_FAILURE'
export const RESET_NEW_BUSINESS: 'RESET_NEW_BUSINESS' = 'RESET_NEW_BUSINESS'

//Fetch businesses
export const FETCH_BUSINESSES: 'FETCH_BUSINESSES' = 'FETCH_BUSINESSES'
export const FETCH_BUSINESSES_SUCCESS: 'FETCH_BUSINESSES_SUCCESS' = 'FETCH_BUSINESSES_SUCCESS'
export const FETCH_BUSINESSES_FAILURE: 'FETCH_BUSINESSES_FAILURE' = 'FETCH_BUSINESSES_FAILURE'
export const RESET_BUSINESSES: 'RESET_BUSINESSES' = 'RESET_BUSINESSES'

export type Business = {
  id: number,
  name: string
}

type FetchBusinessesAction = {
  type: typeof FETCH_BUSINESSES
}

type FetchBusinessesSuccessAction = {
  type: typeof FETCH_BUSINESSES_SUCCESS,
  payload: [Business]
}

type FetchBusinessesFailureAction = {
  type: typeof FETCH_BUSINESSES_FAILURE,
  error: string
}

type CreateBusinessAction = {
  type: typeof CREATE_BUSINESS,
  payload: Business
}

type CreateBusinessSuccessAction = {
  type: typeof CREATE_BUSINESS_SUCCESS,
  payload: Business
}

type CreateBusinessFailureAction = {
  type: typeof CREATE_BUSINESS_FAILURE,
  error: string
}

export type Action =
  | FetchBusinessesAction
  | FetchBusinessesSuccessAction
  | FetchBusinessesAction
  | CreateBusinessAction
  | CreateBusinessSuccessAction
  | CreateBusinessFailureAction


export const fetchBusinessesRequest = (): FetchBusinessesAction => {
  return {
    type: FETCH_BUSINESSES
  }
}

export const fetchBusinessesSuccess = (businesses: [Business]): FetchBusinessesSuccessAction => {
  return {
    type: FETCH_BUSINESSES_SUCCESS,
    payload: normalize(businesses, businessListSchema),
    receivedAt: Date.now()
  }
}

export const fetchBusinessesFailure = (error: string): FetchBusinessesFailureAction => {
  return {
    type: FETCH_BUSINESSES_FAILURE,
    error: error
  }
}

export const fetchBusinesses = (token: string): ((d: Dispatch) => Promise<*>) => {

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


export const createBusinessRequest = (payload: Business): CreateBusinessAction => {

  return {
    type: CREATE_BUSINESS,
    payload
  }
}

export const createBusinessSuccess = (payload: Business): CreateBusinessSuccessAction => {
  return {
    type: CREATE_BUSINESS_SUCCESS,
    receivedAt: Date.now(),
    payload
  }
}

export const createBusinessError = (error: string): CreateBusinessFailureAction => {
  return {
    type: CREATE_BUSINESS_FAILURE,
    error: error
  }
}


export const createBusiness = (data: Business, token: string): ((d: Dispatch) => Promise<*>) => {

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
