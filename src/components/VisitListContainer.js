// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { fetchVisits } from "../actions/visits";
import VisitList from "./VisitList";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";

type Props = {
  visits: Array<Visit>,
  job: Job,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch
};

type State = {};

class VisitListContainer extends Component<void, Props, State> {
  state: State = {};

  componentDidMount() {
    const { job, visits, token, dispatch } = this.props;
    if (!visits.length && token) {
      dispatch(
        fetchVisits(token, {
          job: job.id,
          ordering: "begins",
          begins__gt: moment().format("YYYY-MM-DD")
        })
      );
    }
  }

  render() {
    const { visits, isFetching } = this.props;
    return (
      <VisitList visits={visits} isFetching={isFetching} onMore={this.onMore} />
    );
  }

  onMore = () => {};
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    dispatch: Dispatch,
    job: Job
  }
): Props => {
  const { auth, entities, visits } = state;

  return {
    job: ownProps.job,
    visits: visits.result.map((Id: number) => {
      return entities.visits[Id];
    }),
    isFetching: visits.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch
  };
};

export default connect(mapStateToProps)(VisitListContainer);
