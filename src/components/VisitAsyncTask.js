// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import VisitListContainer from "../components/VisitListContainer";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Business } from "../actions/businesses";
import type { Job } from "../actions/jobs";
import type { AsyncTask, AsyncTaskState } from "../actions/asynctasks";
import { ensureState } from "redux-optimistic-ui";
import asyncTasksApi from "../api";

type Props = {
  business: Business,
  job: Job,
  task: ?AsyncTask,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch
};

type State = {
  taskState: ?AsyncTaskState
};

class VisitAsyncTask extends Component<Props, State> {
  intervalId: IntervalID;
  state = {
    taskState: null
  };

  componentDidMount() {
    const { token, job } = this.props;
    if (token) {
      this.intervalId = setInterval(() => {
        this.fetchAsyncTask(job.schedule_visits_task, token).then(
          (responseAsyncTask: AsyncTask) => {
            this.setState({ taskState: responseAsyncTask.state });
          }
        );
      }, 1000);
    }
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
      return <div>Fetching</div>;
    } else if (this.state.taskState === "STARTED") {
      return <div>Generating visits</div>;
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
  const { auth, asyncTasks, entities } = state;

  return {
    task: ensureState(entities).asyncTasks[ownProps.job.schedule_visits_task],
    business: ensureState(entities).businesses[ownProps.job.business],
    job: ownProps.job,
    isFetching: asyncTasks.isFetching,
    token: auth.token
  };
};

export default connect(mapStateToProps)(VisitAsyncTask);
