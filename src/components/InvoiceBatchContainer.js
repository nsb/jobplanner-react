// @flow

import { connect } from "react-redux";
import InvoiceBatch from "./InvoiceBatch";
import { jobsWithRequiresInvoicing } from "../selectors/jobSelectors";
import { getClientById } from "../selectors/clientSelectors";
import { getVisitById } from "../selectors/visitSelectors";
import type { Props } from "./InvoiceBatch";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {}
): Props => {

  const jobs = jobsWithRequiresInvoicing(state);

  // return {
  //   clients: jobs.reduce((acc, job) => ({ ...acc, [job.client]: getClientById(state, { id: job.client }) }), {}),
  //   jobs: jobs.reduce((acc, job) => ({ ...acc, [job.id]: job }), {}),
  //   visits: jobs.flatMap((job) => { return job.visits.map((visit) => { return getVisitById(state, { id: visit }) }) })
  // };

  return {
    clients: jobs.reduce((acc, job) => ({ ...acc, [job.client]: getClientById(state, { id: job.client }) }), {}),
    jobs: jobs.reduce((acc, job) => ({ ...acc, [job.id]: job }), {}),
    visits: jobs.flatMap((job) => { return job.visits.map((visit) => { return getVisitById(state, { id: visit }) }) }).reduce((acc, visit) => ({ ...acc, [visit.id]: visit }), {})
  };
};

export default connect(mapStateToProps)(InvoiceBatch);
