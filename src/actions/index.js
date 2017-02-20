export * from './auth'
export * from './nav'
export * from './clients'
export * from './businesses'

import { verify } from './auth'
import { fetchBusinesses } from './businesses'

export const verifyAuthAndFetchBusinesses = (token) => {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(verify(token)),
      dispatch(fetchBusinesses(token))
    ])
  }
}
