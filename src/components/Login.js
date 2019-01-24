// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Button from "grommet/components/Button";
import Box from "grommet/components/Box";
import Split from "grommet/components/Split";
import Sidebar from "grommet/components/Sidebar";
import Footer from "grommet/components/Footer";
import PlatformGoogleIcon from "grommet/components/icons/base/PlatformGoogle";
import logo from "../logo.svg";
import Auth from "../auth/Auth";
import LoginForm from "./LoginForm";
import { login } from "../actions/auth";
import type { Credentials } from "../actions/auth";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";

type Props = {
  loginBusy: boolean,
  isAuthenticated: boolean,
  dispatch: Dispatch,
  googleAuth: typeof Auth
};

class Login extends Component<Props> {
  googleAuth: typeof Auth

  onSubmit = (credentials: Credentials) => {
    this.props.dispatch(login(credentials));
  };

  render() {
    const { isAuthenticated, googleAuth } = this.props;

    return isAuthenticated ? (
      <Redirect to="/" />
    ) : (
        <Split flex="left">
          <div>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <Sidebar justify="between" align="center" pad="none" size="large">
            <span />
            <Box>
              <Box pad="medium">
                <Button icon={<PlatformGoogleIcon />}
                  primary={true}
                  fill={true}
                  type="button"
                  label="Login with Google"
                  onClick={googleAuth.login} />
              </Box>
              <Box pad={{ horizontal: "medium", vertical: "none" }} align="center">or</Box>
              <Box>
                <LoginForm
                  onSubmit={this.onSubmit}
                />
              </Box>
            </Box>
            <Footer
              direction="row"
              size="small"
              pad={{ horizontal: "medium", vertical: "small", between: "small" }}
            >
              <span className="secondary">© 2019 myJobPlanner</span>
            </Footer>
          </Sidebar>
        </Split>
      );
  }
}

const mapStateToProps = (
  state: State,
  ownProps: { dispatch: Dispatch, googleAuth: typeof Auth }
): Props => {
  const { auth } = state;

  return {
    loginBusy: auth.busy,
    isAuthenticated: auth.isAuthenticated,
    dispatch: ownProps.dispatch,
    googleAuth: ownProps.googleAuth
  };
};

export default connect(mapStateToProps)(Login);
