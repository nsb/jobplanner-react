// @flow

import { groupBy } from "lodash/collection";
import { createSelector } from "reselect";
import { getClientById } from "./clientSelectors";
import type { State as ReduxState } from "../types/State";
import type { Job, JobStatus } from "../actions/jobs";
import { ensureState } from "redux-optimistic-ui";

const jobsSelector = (state: ReduxState) => ensureState(state.entities).jobs;
const idSelector = (state, props) => props.id;

export const getJobById: (ReduxState, Object) => Job = createSelector(
  jobsSelector,
  idSelector,
  (jobs, id) => jobs[id]
);

const state = state => state;

export const jobs = (state: ReduxState): Array<Job> => {
  return state.jobs.result.map((Id: number): Job => {
    return ensureState(state.entities).jobs[Id];
  });
};

export const jobsSorted = createSelector(jobs, jobs =>
  jobs.sort((a: Job, b: Job) => {
    const jobStatusOrder: Map<JobStatus, number> = new Map([
      ["requires_invoicing", 0],
      ["has_late_visit", 1],
      ["today", 2],
      ["upcoming", 3],
      ["action_required", 4],
      ["archived", 5]
    ]);
    const defaultJobStatusOrder = 6;

    const statusA = jobStatusOrder.get(a.status);
    const statusB = jobStatusOrder.get(b.status);
    if (a.status === b.status) {
      if (a.begins < b.begins) {
        return -1;
      } else if (a.begins > b.begins) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return (
        (statusA === undefined ? defaultJobStatusOrder : statusA) -
        (statusB === undefined ? defaultJobStatusOrder : statusB)
      );
    }
  })
);

export const jobsWithRequiresInvoicing: Function = createSelector(
  jobs,
  (jobs: Array<Job>) => jobs.filter(job => job.status === "requires_invoicing")
);

export const groupJobsByClient: Function = createSelector(
  state,
  jobs,
  (state, jobs) =>
    groupBy(jobs, job => getClientById(state, { id: job.client }))
);

export const jobsWithRequiresInvoicingGroupedByClient: Function = createSelector(
  state,
  jobsWithRequiresInvoicing,
  (state, jobs) =>
    groupBy(jobs, job => getClientById(state, { id: job.client }))
);
