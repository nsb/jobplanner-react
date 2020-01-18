// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from "react-intl";
import JobDetail from "./JobDetail";
import { fetchJob, partialUpdateJob } from "../actions/jobs";
import { fetchClient } from "../actions/clients";
import type { Job } from "../actions/jobs";
import type { Props } from "./JobDetail";
import type { State as ReduxState } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, jobId: number } },
    history: { push: string => void },
    fetchJob: (string, number) => ThunkAction,
    partialUpdateJob: (number, string) => ThunkAction,
    deleteJob: (Job, string) => ThunkAction,
    resetVisits: () => ThunkAction
  }
): Props => {
  const { entities, jobs } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);
  const job = ensureState(entities).jobs[jobId];

  return {
    business: ensureState(entities).businesses[businessId],
    isFetching: jobs.isFetching,
    push: ownProps.history.push,
    client: job && ensureState(entities).clients[job.client],
    property: job && ensureState(entities).properties[job.property],
    lineItems:
      job &&
      job.line_items.map(lineItem => ensureState(entities).lineItems[lineItem]),
    fetchJob: ownProps.fetchJob,
    partialUpdateJob: ownProps.partialUpdateJob,
    resetVisits: ownProps.resetVisits,
    job,
    jobId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      resetVisits: () => dispatch({ type: "RESET_VISITS" }),
      fetchJob,
      partialUpdateJob,
      fetchClient
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(JobDetail));
