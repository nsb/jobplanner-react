// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InvoiceBatch from "./InvoiceBatch";
import { createInvoice } from "../actions/invoices";
import { jobsWithRequiresInvoicing } from "../selectors/jobSelectors";
import { getClientById } from "../selectors/clientSelectors";
import { getVisitById } from "../selectors/visitSelectors";
import type { Props } from "./InvoiceBatch";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    createInvoice: (Array<{client: number, visits: Array<number>}>, string) => ThunkAction
  }
): Props => {

  const jobs = jobsWithRequiresInvoicing(state);
  const { auth } = state;

  return {
    clients: jobs.reduce((acc, job) => ({ ...acc, [job.client]: getClientById(state, { id: job.client }) }), {}),
    jobs: jobs.reduce((acc, job) => ({ ...acc, [job.id]: job }), {}),
    visits: jobs.flatMap((job) => { return job.visits.map((visit) => { return getVisitById(state, { id: visit }) }) }).reduce((acc, visit) => ({ ...acc, [visit.id]: visit }), {}),
    createInvoice: ownProps.createInvoice,
    token: auth.token
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createInvoice
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceBatch);
