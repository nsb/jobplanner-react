// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Split from "grommet/components/Split";
import Sidebar from "grommet/components/Sidebar";
import Footer from "grommet/components/Footer";
import PlatformGoogleIcon from "grommet/components/icons/base/PlatformGoogle";
import SignupForm from "./SignupForm";
import logo from "../logo.svg";
import Auth from "../auth/Auth";
import { signup } from "../actions/auth";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

type Props = {
  signupBusy: boolean,
  isAuthenticated: boolean,
  dispatch: Dispatch,
  googleAuth: typeof Auth
};

class Signup extends Component<Props> {
  googleAuth: typeof Auth

  onSubmit = (user: { username: string }) => {
    this.props.dispatch(signup({ businesses: [], ...user }));
  };

  render() {
    const { googleAuth } = this.props;

    return (
      <Split flex="left">
        <div>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <Sidebar justify="between" align="center" pad="medium" size="large">
          <span />
          <Box size="large">
            <Box pad="medium">
              <Button icon={<PlatformGoogleIcon />}
                primary={true}
                fill={true}
                type="button"
                label="Signup with Google"
                onClick={googleAuth.login} />
            </Box>
            <Box pad={{ horizontal: "medium", vertical: "none" }} align="center">or</Box>
            <Box>
              <SignupForm
                align="start"
                title="jobPlanner"
                onSubmit={this.props.signupBusy ? undefined : this.onSubmit}
              />
            </Box>
          </Box>
          <Footer
            direction="row"
            size="small"
            pad={{ horizontal: "medium", vertical: "small", between: "small" }}
          >
            <span className="secondary">© 2019 jobPlanner</span>
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
