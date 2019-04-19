// @flow

import { connect } from "react-redux";
import InvoiceBatchJob from "./InvoiceBatchJob";
import { getVisitById } from "../selectors/visitSelectors";
import type { Props } from "./InvoiceBatchJob";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { State as ReduxState } from "../types/State";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job: Job,
    visits: Array<Visit>
  }
): Props => {

  console.log(ownProps.job.visits);
  return {
    job: ownProps.job,
    visits: ownProps.job.visits.map((visit) => getVisitById(state, { id: visit }))
  };
};

export default connect(mapStateToProps)(InvoiceBatchJob);
