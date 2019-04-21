// @flow

import { connect } from "react-redux";
import InvoiceBatchJob from "./InvoiceBatchJob";
import { getVisitById } from "../selectors/visitSelectors";
import type { Props } from "./InvoiceBatchJob";
import type { Job } from "../actions/jobs";
import type { Visit } from "../actions/visits";
import type { State as ReduxState } from "../types/State";
import type { JobSelection } from "./InvoiceBatchJob";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job: Job,
    visits: Array<Visit>,
    selected: JobSelection,
    onChange: (JobSelection) => void
  }
): Props => {

  return {
    job: ownProps.job,
    visits: ownProps.job.visits.map((visit) => getVisitById(state, { id: visit })),
    selected: ownProps.selected,
    onChange: ownProps.onChange
  };
};

export default connect(mapStateToProps)(InvoiceBatchJob);
