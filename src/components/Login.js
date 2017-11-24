// @flow

import React, {Component} from 'react';
import { bindActionCreators } from "redux";
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';
import LoginForm from 'grommet/components/LoginForm';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import Footer from 'grommet/components/Footer';
import logo from '../logo.svg';
import {login} from '../actions/auth';
import type {Credentials} from '../actions/auth';
import type { Dispatch, ThunkAction } from '../types/Store'
import type {State} from '../types/State';

type Props = {
  loginBusy: boolean,
  isAuthenticated: boolean,
  login: (Credentials) => ThunkAction
};

class Login extends Component<Props> {
  onSubmit = (credentials: Credentials) => {
    this.props.login(credentials);
  };

  render() {
    const {isAuthenticated} = this.props;

    return isAuthenticated ? (
      <Redirect to="/"/>
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
            pad={{horizontal: 'medium', vertical: 'small', between: 'small'}}
          >
            <span className="secondary">© 2017 jobPlanner</span>
          </Footer>
        </Sidebar>
      </Split>
    );
  }
}

const mapStateToProps = (state: State) => {
  const {auth} = state;

  return {
    loginBusy: auth.busy,
    isAuthenticated: auth.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      login
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
