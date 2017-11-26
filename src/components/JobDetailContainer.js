// @flow

import { connect } from "react-redux";
import JobDetail from "./JobDetail";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { Property } from "../actions/properties";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Responsive } from "../actions/nav";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  job: Job,
  lineItems: Array<Object>,
  jobId: number,
  property: Property,
  token: string,
  isFetching: boolean,
  dispatch: Dispatch,
  push: string => void,
  responsive: Responsive,
  saved: boolean
};

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, jobId: number } },
    history: { push: string => void },
    dispatch: Dispatch
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
        job.line_items.map(
          lineItem => ensureState(entities).lineItems[lineItem]
        ),
    dispatch: ownProps.dispatch,
    job,
    jobId
  };
};

export default connect(mapStateToProps)(JobDetail);
