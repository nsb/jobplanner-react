// @flow
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import { fetchVisits } from "../actions/visits";
import VisitList from "./VisitList";
import getVisitsByJob from "../selectors/visitSelectors";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  visits: Array<Visit>,
  job: Job,
  token: ?string,
  isFetching: boolean,
  totalCount: number,
  fetchVisits: (string, Object) => ThunkAction
};

type State = {
  offset: number,
  limit: number
};

class VisitListContainer extends Component<Props, State> {
  intervalId: number = -1;
  state = {
    offset: 0,
    limit: 10
  };

  componentDidMount() {
    this.onMore();
  }

  render() {
    const { visits, isFetching, totalCount } = this.props;
    return (
      <VisitList
        visits={visits}
        isFetching={isFetching}
        onMore={this.state.offset < totalCount ? this.onMore : null}
      />
    );
  }

  onMore = () => {
    const { job, token } = this.props;
    if (token) {
      fetchVisits(token, {
        job: job.id,
        ordering: "begins",
        begins__gt: moment().format("YYYY-MM-DDT00:00"),
        limit: 10,
        offset: this.state.offset
      });
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job: Job
  }
) => {
  const { auth, visits } = state;

  return {
    job: ownProps.job,
    visits: getVisitsByJob(state, ownProps),
    totalCount: ensureState(visits).count,
    isFetching: ensureState(visits).isFetching,
    token: auth.token
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchVisits
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(VisitListContainer);
