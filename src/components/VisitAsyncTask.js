// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Box from "grommet/components/Box";
import Spinning from "grommet/components/icons/Spinning";
import VisitListContainer from "../components/VisitListContainer";
import { AuthContext } from "../providers/authProvider";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { AsyncTask, AsyncTaskState } from "../actions/asynctasks";
import { ensureState } from "redux-optimistic-ui";
import asyncTasksApi from "../api";

const intlGeneratingVisits = (
  <FormattedMessage
    id="visitAsyncTask.generatingVisits"
    description="Generating visits message"
    defaultMessage="Generating visits..."
  />
);

type Props = {
  business: Business,
  job: Job,
  task: ?AsyncTask,
  isFetching: boolean,
  dispatch: Dispatch
};

type State = {
  taskState: ?AsyncTaskState
};

class VisitAsyncTask extends Component<Props & { intl: intlShape }, State> {
  intervalId: IntervalID;
  state = {
    taskState: null
  };
  static contextType = AuthContext;

  componentDidMount() {
    const { job } = this.props;
    const { getUser } = this.context;

    this.intervalId = setInterval(() => {
      getUser().then(({ access_token }) => {
        return this.fetchAsyncTask(job.schedule_visits_task, access_token)
      }).then(
        (responseAsyncTask: AsyncTask) => {
          this.setState({ taskState: responseAsyncTask.state });
        }
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.taskState === "SUCCESS" ||
      this.state.taskState === "FAILURE" ||
      this.state.taskState === "REVOKED"
    ) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const { business, job } = this.props;
    if (!this.state.taskState || this.state.taskState === "PENDING") {
      return (
        <Article scrollStep={true} controls={true}>
          <Section full={false} pad="large" justify="center" align="center">
            <Spinning size="large" />
          </Section>
        </Article>
      );
    } else if (this.state.taskState === "STARTED") {
      return (
        <Article scrollStep={true} controls={true}>
          <Section full={false} pad="large" justify="center" align="center">
            <Box direction="row" align="center" pad={{between: "small"}}>
              <Spinning size="small" /> {intlGeneratingVisits}
            </Box>
          </Section>
        </Article>
      );
    } else {
      return <VisitListContainer job={job} business={business} />;
    }
  }

  fetchAsyncTask = (id, token) => {
    if (id) {
      return asyncTasksApi.getOne("tasks", id, token);
    } else return Promise.reject();
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job: Job
  }
): * => {
  const { asyncTasks, entities } = state;

  return {
    task: ensureState(entities).asyncTasks[ownProps.job.schedule_visits_task],
    business: ensureState(entities).businesses[ownProps.job.business],
    job: ownProps.job,
    isFetching: asyncTasks.isFetching
  };
};

export default connect(mapStateToProps)(injectIntl(VisitAsyncTask));
