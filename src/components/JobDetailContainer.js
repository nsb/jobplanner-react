// @flow

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from "react-intl";
import JobDetail from "./JobDetail";
import { fetchJob, partialUpdateJob, deleteJob } from "../actions/jobs";
import { navResponsive } from "../actions/nav";
import type { Props } from "./JobDetail";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import { ensureState } from "redux-optimistic-ui";

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, jobId: number } },
    history: { push: string => void },
    fetchJob: Function,
    partialUpdateJob: Function,
    deleteJob: Function,
    navResponsive: Function
  }
): Props => {
  const { auth, entities, jobs, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);
  const job = ensureState(entities).jobs[jobId];

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    isFetching: jobs.isFetching,
    saved: jobs.saved,
    push: ownProps.history.push,
    responsive: nav.responsive,
    property: job && ensureState(entities).properties[job.property],
    lineItems:
      job &&
      job.line_items.map(lineItem => ensureState(entities).lineItems[lineItem]),
    fetchJob: ownProps.fetchJob,
    partialUpdateJob: ownProps.partialUpdateJob,
    deleteJob: ownProps.deleteJob,
    navResponsive: ownProps.navResponsive,
    job,
    jobId
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchJob,
      partialUpdateJob,
      deleteJob,
      navResponsive
    },
    dispatch
  );

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(JobDetail)
);
