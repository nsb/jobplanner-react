// @flow
import { verify } from "./auth";
import { me } from "./users";
import { fetchBusinesses } from "./businesses";
import { fetchJob, fetchJobs } from "./jobs";
import { createVisit, updateVisit, partialUpdateVisit } from "./visits";
import { createInvoice } from "./invoices";
import type { Dispatch, GetState, ThunkAction } from "../types/Store";
import type { Business } from "./businesses";
import type { Visit } from "./visits";
import type { Invoice } from "./invoices";

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

export const createVisitAndLoadJob = (
  business: Business,
  visit: Visit,
  token: string
): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(createVisit(business, visit, token)).then(() => {
      return dispatch(fetchJob(token, visit.job));
    });
  };
};

export const updateVisitAndLoadJob = (
  visit: {
    id: number,
    begins: Date,
    ends: Date,
    anytime: boolean,
    job: number
  },
  token: string,
  optimistic: boolean = false,
  patch: boolean = false
): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(updateVisit(visit, token, optimistic, patch)).then(() => {
      return dispatch(fetchJob(token, visit.job));
    });
  };
};

export const partialUpdateVisitAndLoadJob = (
  visit: { id: number, job: number },
  token: string
): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(partialUpdateVisit(visit, token)).then(() => {
      return dispatch(fetchJob(token, visit.job));
    });
  };
};

export const createInvoiceAndLoadJobs = (
  invoice:
    | Invoice
    | { client: number, visits: Array<number> }
    | Array<Invoice>
    | Array<{ client: number, visits: Array<number> }>,
  token: string,
  queryParams: Object = {}
): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    return dispatch(createInvoice(invoice, token)).then(invoices => {
      const jobIds = invoices.length
        ? [...new Set(invoices.flatMap(invoice => invoice.jobs))]
        : invoices.jobs;
      return dispatch(
        fetchJobs(token, { ...queryParams, id__in: jobIds.join() })
      );
    });
  };
};
