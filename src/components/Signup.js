// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SignupForm from "./SignupForm";
import Split from "grommet/components/Split";
import Sidebar from "grommet/components/Sidebar";
import Footer from "grommet/components/Footer";
import logo from "../logo.svg";
import { signup } from "../actions/auth";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

type Props = {
  signupBusy: boolean,
  isAuthenticated: boolean,
  dispatch: Dispatch
};

class Signup extends Component<Props> {
  onSubmit = (user: { username: string }) => {
    this.props.dispatch(signup({ businesses: [], ...user }));
  };

  render() {
    return (
      <Split flex="left">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <Sidebar justify="between" align="center" pad="none" size="large">
          <span />
          <SignupForm
            align="start"
            title="jobPlanner"
            onSubmit={this.props.signupBusy ? undefined : this.onSubmit}
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
  { dispatch }: { dispatch: Dispatch }
): Props => {
  const { auth } = state;

  return {
    signupBusy: auth.busy,
    isAuthenticated: auth.isAuthenticated,
    dispatch: dispatch
  };
};

export default withRouter(connect(mapStateToProps)(Signup));
