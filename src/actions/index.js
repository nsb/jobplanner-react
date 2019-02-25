// @flow
import { verify } from "./auth";
import { me } from "./users";
import { fetchBusinesses } from "./businesses";
import { fetchJob } from "./jobs";
import { partialUpdateVisit } from "./visits";
import type { Dispatch, GetState, ThunkAction } from "../types/Store";

export const verifyAuthAndFetchBusinesses = (
  token: string
): ((d: Dispatch, s: {}) => Promise<*>) => {
  return (dispatch, getState) => {
    return Promise.all([
      dispatch(verify(token)),
      dispatch(me(token)),
      dispatch(fetchBusinesses(token))
    ]);
  };
};

export const partialUpdateVisitAndLoadJob = (
  visit: { id: number, job: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(partialUpdateVisit(visit, token)).then(() => {
      dispatch(fetchJob(token, visit.job));
    });
  };
};
