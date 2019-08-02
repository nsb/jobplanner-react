// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InvoiceBatch from "./InvoiceBatch";
import { createInvoiceAndLoadJobs } from "../actions/index";
import { jobsWithRequiresInvoicing } from "../selectors/jobSelectors";
import { getClientById } from "../selectors/clientSelectors";
import { getVisitById } from "../selectors/visitSelectors";
import type { Business } from "../actions/businesses";
import type { Props } from "./InvoiceBatch";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    createInvoiceAndLoadJobs: (Array<{client: number, visits: Array<number>}>, string, Object) => ThunkAction,
    business: Business
  }
): Props => {

  const jobs = jobsWithRequiresInvoicing(state);
  const { invoices, auth } = state;

  return {
    clients: jobs.reduce((acc, job) => { acc.set(job.client, getClientById(state, { id: job.client })); return acc; }, new Map()),
    jobs: jobs.reduce((acc, job) => { acc.set(job.id, job); return acc; }, new Map()),
    visits: jobs.flatMap((job) => { return job.visits.map((visit) => { return getVisitById(state, { id: visit }) }) }).reduce((acc, visit) => { acc.set(visit.id, visit); return acc;}, new Map()),
    createInvoiceAndLoadJobs: ownProps.createInvoiceAndLoadJobs,
    token: auth.token,
    business: ownProps.business,
    isFetching: invoices.isFetching
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createInvoiceAndLoadJobs
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceBatch);
