import { push } from 'react-router-redux'
import businessesApi from '../api/BusinessesApi'

//Create new client
export const CREATE_BUSINESS = 'CREATE_BUSINESS';
export const CREATE_BUSINESS_SUCCESS = 'CREATE_BUSINESS_SUCCESS';
export const CREATE_BUSINESS_FAILURE = 'CREATE_BUSINESS_FAILURE';
export const RESET_NEW_BUSINESS = 'RESET_NEW_BUSINESS';

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
