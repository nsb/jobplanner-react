// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import LoginForm from "grommet/components/LoginForm";
import Split from "grommet/components/Split";
import Sidebar from "grommet/components/Sidebar";
import Footer from "grommet/components/Footer";
import logo from "../logo.svg";
import Auth from "../auth/Auth";
import { login } from "../actions/auth";
import type { Credentials } from "../actions/auth";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

type Props = {
  loginBusy: boolean,
  isAuthenticated: boolean,
  dispatch: Dispatch,
  auth: typeof Auth
};

class Login extends Component<Props> {
  auth: typeof Auth

  constructor(props: Props) {
    super();
    const { isAuthenticated, auth } = props;

    if(!isAuthenticated) {
      auth.login()
    }
  }

  onSubmit = (credentials: Credentials) => {
    this.props.dispatch(login(credentials));
  };

  render() {
    const { isAuthenticated } = this.props;

    return isAuthenticated ? (
      <Redirect to="/" />
    ) : (
      <Split flex="left">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <Sidebar justify="between" align="center" pad="none" size="large">
          <span />
          <LoginForm
            align="start"
            title="jobPlanner"
            onSubmit={this.props.loginBusy ? undefined : this.onSubmit}
            usernameType="text"
          />
          
          <Footer
            direction="row"
            size="small"
            pad={{ horizontal: "medium", vertical: "small", between: "small" }}
          >
            <span className="secondary">© 2017 jobPlanner</span>
          </Footer>
        </Sidebar>
      </Split>
    );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: { dispatch: Dispatch, auth: typeof Auth }
): Props => {
  const { auth } = state;

  return {
    loginBusy: auth.busy,
    isAuthenticated: auth.isAuthenticated,
    dispatch: ownProps.dispatch,
    auth: ownProps.auth
  };
};

export default withRouter(connect(mapStateToProps)(Login));
