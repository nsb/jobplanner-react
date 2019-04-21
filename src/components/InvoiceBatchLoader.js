// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ensureState } from "redux-optimistic-ui";
import { fetchJobs } from "../actions/jobs";
import Box from 'grommet/components/Box';
import InvoiceBatchContainer from "./InvoiceBatchContainer";
import type { Business } from "../actions/business";
import type { State as ReduxState } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";

export type Props = {
  business: Business,
  token: ?string,
  isFetching: boolean,
  fetchJobs: (string, Object) => ThunkAction
};
  
class InvoiceBatchLoader extends Component<Props> {

  componentDidMount() {
    const { token, fetchJobs, business } = this.props;
    if (token) {
      fetchJobs(token, { business: business.id,  status: 'requires_invoicing' });
    }
  }

  render() {
    const { isFetching } = this.props;
    if (isFetching) {
      return (
        <Box>Davs</Box>
      )
    } else {
      return (
        <InvoiceBatchContainer />
      )  
    }
  }
};

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number } },
    fetchJobs: (string, Object) => ThunkAction,
  }
): Props => {
  const { auth, jobs, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    token: auth.token,
    isFetching: jobs.isFetching,
    fetchJobs: ownProps.fetchJobs
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchJobs,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceBatchLoader);
