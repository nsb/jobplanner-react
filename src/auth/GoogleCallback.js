// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Auth from "../auth/Auth";
import Loading from "../components/Loading";
import { loginSocial } from "../actions/auth";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

type Props = {
  isAuthenticated: boolean,
  dispatch: Dispatch,
  auth: typeof Auth
};

class GoogleCallback extends Component<Props> {

  componentDidMount() {
    const code = new URLSearchParams(document.location.search).get("code") || "";
    this.props.dispatch(loginSocial({provider: 'google-oauth2', code: code}));
  }

  render() {
    const { isAuthenticated } = this.props;

    return isAuthenticated ? <Redirect to="/" /> : <Loading />
  }
}

const mapStateToProps = (
  state: State,
  ownProps: { dispatch: Dispatch, auth: typeof Auth }
): Props => {
  const { auth } = state;

  return {
    isAuthenticated: auth.isAuthenticated,
    dispatch: ownProps.dispatch,
    auth: ownProps.auth
  };
};

export default connect(mapStateToProps)(GoogleCallback);
