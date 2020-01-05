// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { injectIntl, intlShape, FormattedMessage } from "react-intl";
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

const intlAuthFailed = (
  <FormattedMessage
    id="login.authFailed"
    description="Login auth failed message"
    defaultMessage="Invalid username or password."
  />
)

const intlwithGoogle = (
  <FormattedMessage
    id="login.withGoogle"
    description="Login with Google"
    defaultMessage="Login with Google"
  />
)

const intlOr = (
  <FormattedMessage
    id="login.or"
    description="Login or"
    defaultMessage="or"
  />
)

type Props = {
  authFailed: boolean,
  loginBusy: boolean,
  isAuthenticated: boolean,
  dispatch: Dispatch,
  googleAuth: typeof Auth
};

class Login extends Component<Props & { intl: intlShape }> {
  googleAuth: typeof Auth

  onSubmit = (credentials: Credentials) => {
    this.props.dispatch(login(credentials));
  };

  render() {
    const { isAuthenticated, googleAuth, authFailed } = this.props;

    let errors = [];
    if (authFailed) {
      errors.push(intlAuthFailed);
    }

    return isAuthenticated ? (
      <Redirect to="/" />
    ) : (
        <Split flex="left">
          <Box align="start" pad="medium">
            <img src={logo} className="App-logo" alt="logo" />
          </Box>
          <Sidebar justify="between" align="center" pad="medium" size="large">
            <span />
            <Box size="large">
              <Box pad="medium">
                <Button icon={<PlatformGoogleIcon />}
                  primary={true}
                  fill={true}
                  type="button"
                  label={intlwithGoogle}
                  onClick={googleAuth.login} />
              </Box>
              <Box pad={{ horizontal: "medium", vertical: "none" }} align="center">{intlOr}</Box>
              <Box>
                <LoginForm
                  onSubmit={this.onSubmit}
                  errors={errors}
                />
              </Box>
            </Box>
            <Footer
              direction="row"
              size="small"
              pad={{ horizontal: "medium", vertical: "small", between: "small" }}
            >
              <span className="secondary">© 2020 myJobPlanner</span>
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
    authFailed: auth.authFailed,
    loginBusy: auth.busy,
    isAuthenticated: auth.isAuthenticated,
    dispatch: ownProps.dispatch,
    googleAuth: ownProps.googleAuth
  };
};

export default connect(mapStateToProps)(injectIntl(Login));
