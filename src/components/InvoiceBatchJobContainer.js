// @flow

import { connect } from "react-redux";
import { ensureState } from "redux-optimistic-ui";
import InvoiceBatchJob from "./InvoiceBatchJob";
import type { Props } from "./InvoiceBatchJob";
import type { Job } from "../actions/jobs";
import type { State as ReduxState } from "../types/State";
import type { JobSelection } from "../utils/invoices";

const mapStateToProps = (
  { entities }: ReduxState,
  {
    job,
    selected,
    onChange
  }: {
    job: Job,
    selected: JobSelection,
    onChange: JobSelection => void
  }
): Props => {
  return {
    visits: job.visits.map(visitId => ensureState(entities).visits[visitId]),
    job,
    selected,
    onChange
  };
};

export default connect(mapStateToProps)(InvoiceBatchJob);
