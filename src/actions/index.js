export * from './auth'
export * from './nav'
export * from './clients'
export * from './businesses'
export * from './users'

import { me } from './users'
import { fetchBusinesses } from './businesses'

export const verifyAuthAndFetchBusinesses = (token) => {
  return (dispatch, getState) => {
    return Promise.all([
      // dispatch(verify(token)),
      dispatch(me(token)),
      dispatch(fetchBusinesses(token))
    ])
  }
}
