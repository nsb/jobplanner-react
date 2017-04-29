// @flow
import {me} from './users';
import {fetchBusinesses} from './businesses';
import type {Dispatch} from '../types/Store';

export const verifyAuthAndFetchBusinesses = (
  token: string
): ((d: Dispatch, s: {}) => Promise<*>) => {
  return (dispatch, getState) => {
    return Promise.all([
      // dispatch(verify(token)),
      dispatch(me(token)),
      dispatch(fetchBusinesses(token)),
    ]);
  };
};
