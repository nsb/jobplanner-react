// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";
import JobDetail from "./JobDetail";
import { fetchJob } from "../actions/jobs";
import { navResponsive } from "../actions/nav";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { State as ReduxState } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Responsive } from "../actions/nav";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  job: Job,
  jobId: number,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  push: string => void,
  responsive: Responsive,
  saved: boolean
};

class JobDetailContainer extends Component<Props> {
  componentDidMount() {
    const { job, jobId, token, dispatch } = this.props;
    if (!job && token) {
      dispatch(fetchJob(token, jobId));
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({type: "CLEAR_JOB_NOTIFICATIONS"});
  }

  render() {
    const {
      business,
      job,
      responsive,
      isFetching,
      saved
    } = this.props;

    const jobDetail = (
      <JobDetail
        business={business}
        job={job}
        responsive={responsive}
        onEdit={this.onEdit}
        onClose={this.onClose}
        onResponsive={this.onResponsive}
        saved={saved}
      />
    );

    const loadingJob = (
      <Article scrollStep={true} controls={true}>
        <Section
          full={true}
          colorIndex="dark"
          // texture="url(img/ferret_background.png)"
          pad="large"
          justify="center"
          align="center"
        >
          <Spinning />
        </Section>
      </Article>
    );

    return isFetching ? loadingJob : jobDetail;
  }

  onResponsive = (responsive: Responsive) => {
    this.props.dispatch(navResponsive(responsive));
  };

  onClose = () => {
    const { business, push } = this.props;
    push(`/${business.id}/jobs`);
  };

  onEdit = () => {
    const { business, job, push } = this.props;
    push(`/${business.id}/jobs/${job.id}/edit`);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, jobId: number } },
    history: { push: string => void }
  }
) => {
  const { auth, entities, jobs, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const jobId = parseInt(ownProps.match.params.jobId, 10);

  return {
    token: auth.token,
    business: ensureState(entities).businesses[businessId],
    job: ensureState(entities).jobs[jobId],
    isFetching: jobs.isFetching,
    saved: jobs.saved,
    push: ownProps.history.push,
    responsive: nav.responsive,
    jobId
  };
};

export default connect(mapStateToProps)(JobDetailContainer);
