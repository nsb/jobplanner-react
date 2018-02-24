// @flow

import { createSelector } from "reselect";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import { ensureState } from "redux-optimistic-ui";

export const getVisits = (state: ReduxState): Array<Visit> => {
  return ensureState(state.visits).result.map((Id: number): Visit => {
    return ensureState(state.entities).visits[Id];
  });
};

export const getJob = (state: ReduxState, props: { job: Job }): Job => {
  return props.job;
};

export const getVisitsByJob: Function = createSelector(
  [getVisits, getJob],
  (visits: Array<Visit>, job: Job): Array<Visit> => {
    return visits
      .filter(visit => visit.job === job.id && !visit.completed)
      .sort((a, b) => {
        return new Date(a.begins) - new Date(b.begins);
      });
  }
);

export default getVisitsByJob;
