// @flow

import { createSelector } from "reselect";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";

const getVisits = (state: ReduxState): Array<Visit> =>
  state.visits.result.map((Id: number): Visit => {
    return state.entities.visits[Id];
  });

const getJob = (state: ReduxState, props: { job: Job }): Job => {
  return props.job;
};

export const getVisitsByJob: Function = createSelector(
  [getVisits, getJob],
  (visits: Array<Visit>, job: Job) => {
    return visits.filter(visit => visit.job === job.id);
  }
);

export default getVisitsByJob;