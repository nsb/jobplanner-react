// @flow

import { groupBy } from "lodash/collection";
import { createSelector } from "reselect";
import { getClientById } from "./clientSelectors";
import type { State as ReduxState } from "../types/State";
import type { Job } from "../actions/jobs";
// import type { Client } from "../actions/clients";
import { ensureState } from "redux-optimistic-ui";

const jobsSelector = (state: ReduxState) => ensureState(state.entities).jobs;
const idSelector = (state, props) => props.id;

export const getJobById: (ReduxState, Object) => Job = createSelector(
  jobsSelector,
  idSelector,
  (jobs, id) => jobs[id]
);

const state = state => state;

const jobs = (state: ReduxState): Array<Job> => {
  return ensureState(state.jobs).result.map(
    (Id: number): Job => {
      return ensureState(state.entities).jobs[Id];
    }
  );
};

export const jobsWithRequiresInvoicing: Function = createSelector(
  jobs,
  (jobs: Array<Job>) => jobs.filter((job) => job.status === 'requires_invoicing' )
);

export const groupJobsByClient: Function = createSelector(
  state,
  jobs,
  (state, jobs) => groupBy(jobs, job => getClientById(state, { id: job.client }))
);

export const jobsWithRequiresInvoicingGroupedByClient: Function = createSelector(
  state,
  jobsWithRequiresInvoicing,
  (state, jobs) => groupBy(jobs, job => getClientById(state, { id: job.client }))
);