// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { fetchVisits } from "../actions/visits";
import VisitList from "./VisitList";
import getVisitsByJob from "../selectors/visitSelectors";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import { ensureState } from "redux-optimistic-ui";
import type { AsyncTask, AsyncTaskState } from "../actions/asynctasks";
import { fetchAsyncTask } from "../actions/asynctasks";

type Props = {
  visits: Array<Visit>,
  job: Job,
  task: ?AsyncTask,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  totalCount: number
};

type State = {
  offset: number,
  limit: number,
  taskState: AsyncTaskState
};

class VisitListContainer extends Component<Props, State> {
  intervalId: number;
  state = {
    offset: 0,
    limit: 10,
    taskState: "PENDING"
  };

  componentDidMount() {
    const { job, task, token, dispatch } = this.props;

    if (token) {
      console.log("******** start interval *********")
      this.intervalId = setInterval(() => {
        dispatch(fetchAsyncTask(token, job.schedule_visits_task));
      }, 2000);
    }

    // this.onMore();
  }

  componentWillReceiveProps(nextProps) {
    const { task } = nextProps;
    if (
      task &&
      (task.state === "SUCCESS" ||
        task.state === "FAILURE" ||
        task.state === "REVOKED")
    ) {
      console.log("********* clear interval **********")
      clearInterval(this.intervalId);
      // if (
      //   task.state === "SUCCESS" &&
      //   this.props.task &&
      //   this.props.task.state === "PENDING"
      // ) {
      //   this.onMore();
      // }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  isTaskRunning = () => {
    const { task } = this.props;
    return task && task.state === "PENDING";
  };

  render() {
    const { visits, isFetching, totalCount, task } = this.props;
    return (
      <VisitList
        visits={visits}
        isFetching={isFetching || this.isTaskRunning()}
        onMore={this.state.offset < totalCount ? this.onMore : null}
      />
    );
  }

  onMore = () => {
    const { job, token, dispatch } = this.props;
    if (token) {
      dispatch(
        fetchVisits(token, {
          job: job.id,
          ordering: "begins",
          begins__gt: moment().format("YYYY-MM-DDT00:00"),
          limit: 10,
          offset: this.state.offset
        })
      );
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    job: Job
  }
): Props => {
  const { auth, visits, entities, asyncTasks } = state;

  return {
    job: ownProps.job,
    task: ensureState(entities).asyncTasks[ownProps.job.schedule_visits_task],
    visits: getVisitsByJob(state, ownProps),
    totalCount: ensureState(visits).count,
    isFetching: asyncTasks.isFetching || ensureState(visits).isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch
  };
};

export default connect(mapStateToProps)(VisitListContainer);
