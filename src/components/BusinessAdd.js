// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import type { State as ReduxState } from "../types/State";
import type { Business } from "../actions/businesses";
import Article from "grommet/components/Article";
import BusinessForm from "./BusinessForm";
import { createBusiness } from "../actions/businesses";
import type { Dispatch, ThunkAction } from "../types/Store";

type Props = {
  token: ?string,
  push: string => void,
  createBusiness: (Business, string) => ThunkAction
}

type State = {}

class BusinessAdd extends Component<Props, State> {

  render() {
    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>

        <BusinessForm onSubmit={this.handleSubmit} onClose={this.onClose} />

      </Article>
    );
  }

  handleSubmit = (business: Business) => {
    const { token, createBusiness } = this.props;
    if (token) createBusiness(business, token);
  };

  onClose = () => {
    this.props.push("/");
  };
}

const mapStateToProps = (
  { auth }: ReduxState,
  ownProps: { history: { push: string => void } }
) => ({
  token: auth.token,
  push: ownProps.history.push
});

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      createBusiness
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(BusinessAdd);
