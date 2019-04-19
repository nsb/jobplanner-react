// @flow

import moment from "moment";
import { groupBy } from "lodash/collection";
import { createSelector } from "reselect";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import { ensureState } from "redux-optimistic-ui";

const visitsSelector = (state: ReduxState) => ensureState(state.entities).visits;
const idSelector = (state, props) => props.id;

export const getVisitById: (ReduxState, Object) => Visit = createSelector(
   visitsSelector,
   idSelector,
   (visits, id) => visits[id]
);

type Groupee = "day" | "week" | "month" | "year";

const groupVisits = (
  visits: Array<Visit>,
  groupee: Groupee
): { [key: Date]: Array<Visit> } => {
  return groupBy(visits, visit => moment(visit.begins).startOf(groupee));
};

const groupVisitsByMonth = (visits: Array<Visit>) =>
  groupVisits(visits, "month");

export const getVisits = (state: ReduxState): Array<Visit> => {
  return ensureState(state.visits).result.map(
    (Id: number): Visit => {
      return ensureState(state.entities).visits[Id];
    }
  );
};

export const getVisitsGrouped: Function = createSelector(
  [getVisits],
  groupVisitsByMonth
);

export const getJob = (state: ReduxState, props: { job: Job }): Job => {
  return props.job;
};

export const getVisitsByJob: Function = createSelector(
  [getVisits, getJob],
  (visits: Array<Visit>, job: Job): Array<Visit> => {
    return visits
      .filter(visit => visit.job === job.id && (job.closed ? visit.completed : !visit.completed))
      .sort((a, b) => {
        return job.closed ? b.begins - a.begins : a.begins - b.begins;
      });
  }
);

export const getVisitsByJobGrouped: Function = createSelector(
  [getVisitsByJob],
  groupVisitsByMonth
);

export default getVisitsByJobGrouped;
