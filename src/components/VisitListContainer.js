// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchVisits } from "../actions/visits";
import VisitList from "./VisitList";
import {
  getVisitsByJobGrouped,
  getVisitsGrouped
} from "../selectors/visitSelectors";
import { AuthContext } from "../providers/authProvider";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Visit } from "../actions/visits";
import type { Job } from "../actions/jobs";
import type { Business } from "../actions/businesses";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  visitsGrouped: { [key: Date]: Array<Visit> },
  job?: Job,
  business: Business,
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
    limit: 20
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.onMore();
  }

  render() {
    const { visitsGrouped, isFetching, totalCount, job } = this.props;
    return (
      <VisitList
        visits={visitsGrouped}
        isFetching={isFetching}
        job={job}
        onMore={this.state.offset < totalCount ? this.onMore : null}
      />
    );
  }

  onMore = () => {
    const { business, job, dispatch } = this.props;
    const data = job && job.closed ? {
        business: business.id,
        ordering: "begins",
        limit: 20,
        offset: this.state.offset
      } : {
          business: business.id,
          ordering: "begins",
          completed: false,
          limit: 20,
          offset: this.state.offset
        };
      const { getUser } = this.context;
      getUser().then(({ access_token }) => {  
            dispatch(fetchVisits(access_token, job ? { ...data, job: job.id } : data));
      this.setState({ offset: this.state.offset + this.state.limit });
    });
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    job?: Job,
    business: Business
  }
): * => {
  const { visits } = state;

  return {
    business: ownProps.business,
    job: ownProps.job,
    visitsGrouped: ownProps.job
      ? getVisitsByJobGrouped(state, ownProps)
      : getVisitsGrouped(state),
    totalCount: ensureState(visits).count,
    isFetching: ensureState(visits).isFetching
  };
};

export default connect(mapStateToProps)(VisitListContainer);
