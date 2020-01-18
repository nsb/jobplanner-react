// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ensureState } from "redux-optimistic-ui";
import { fetchJobs } from "../actions/jobs";
import Loading from "./Loading";
import InvoiceBatchContainer from "./InvoiceBatchContainer";
import { AuthContext } from "../providers/authProvider";
import type { Business } from "../actions/businesses";
import type { State as ReduxState } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";

export type Props = {
  business: Business,
  isFetching: boolean,
  fetchJobs: (string, Object) => ThunkAction
};

export type State = {
  allSelected: Boolean
};

class InvoiceBatchLoader extends Component<Props> {
  static contextType = AuthContext;

  componentDidMount() {
    const { fetchJobs, business } = this.props;
    const { getUser } = this.context;

    getUser().then(({ access_token }) => {
      fetchJobs(access_token, {
        business: business.id,
        status: "requires_invoicing",
        limit: 200
      });
    });
  }

  render() {
    const { business, isFetching } = this.props;

    return isFetching ? (
      <Loading />
    ) : (
      <InvoiceBatchContainer business={business} />
    );
  }
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    fetchJobs: (string, Object) => ThunkAction
  }
): Props => {
  const { jobs, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    isFetching: jobs.isFetching,
    fetchJobs: ownProps.fetchJobs
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchJobs
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceBatchLoader);
