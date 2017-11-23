// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import VisitListContainer from "../components/VisitListContainer";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { AsyncTask, AsyncTaskState } from "../actions/asynctasks";
import { ensureState } from "redux-optimistic-ui";
import { fetchAsyncTask } from "../actions/asynctasks";
import asyncTasksApi from "../api";

type Props = {
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
  intervalId: number = -1;
  state = {
    taskState: null
  };

  componentDidMount() {
    const { token, job, dispatch } = this.props;
    if (token) {
      this.intervalId = setInterval(() => {
        this.fetchAsyncTask(
          job.schedule_visits_task,
          token
        ).then((responseAsyncTask: AsyncTask) => {
          this.setState({ taskState: responseAsyncTask.state });
        });
      }, 1000);
    }
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
    const { job, isFetching, task } = this.props;
    if (!this.state.taskState) {
      return <div>Fetching</div>;
    } else if (this.state.taskState === "PENDING") {
      return <div>Generating visits</div>;
    } else {
      return <VisitListContainer job={job} />;
    }
  }

  fetchAsyncTask = (id, token) => {
    if (id) {
      return asyncTasksApi.getOne("asynctasks", id, token);
    } else return Promise.reject();
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    job: Job
  }
): Props => {
  const { auth, asyncTasks, entities } = state;

  return {
    task: ensureState(entities).asyncTasks[ownProps.job.schedule_visits_task],
    job: ownProps.job,
    isFetching: asyncTasks.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch
  };
};

export default connect(mapStateToProps)(VisitAsyncTask);
