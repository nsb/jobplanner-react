// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { fetchVisits } from "../actions/visits";
import VisitList from "./VisitList";
import { getVisitsByJob, getVisits } from "../selectors/visitSelectors";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Business } from "../actions/businesses";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  visits: Array<Visit>,
  job?: Job,
  business: Business,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  totalCount: number
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
    const { business, job, token, dispatch } = this.props;
    if (token) {

      let data = {
        business: business.id,
        ordering: "begins",
        begins__gt: moment().format("YYYY-MM-DDT00:00"),
        limit: 10,
        offset: this.state.offset
      };

      if (job) {
        data.job = job.id;
      }
      dispatch(fetchVisits(token, data));
      this.setState({ offset: this.state.offset + this.state.limit });
    }
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job?: Job,
    business: Business
  }
): * => {
  const { auth, visits } = state;

  return {
    business: ownProps.business,
    job: ownProps.job,
    visits: ownProps.job ? getVisitsByJob(state, ownProps) : getVisits(state),
    totalCount: ensureState(visits).count,
    isFetching: ensureState(visits).isFetching,
    token: auth.token
  };
};

export default connect(mapStateToProps)(VisitListContainer);
