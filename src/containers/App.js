// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route } from "react-router-dom";
import AppGrommet from "grommet/components/App";
import Auth from "../auth/Auth";
import AppAuthenticated from "../containers/AppAuthenticated";
import Login from "../components/Login";
import Signup from "../components/Signup";
import GoogleCallback from "../auth/GoogleCallback";
import type { State } from "../types/State";

import "./App.css";

type Props = {
  token: ?string
}

class App extends Component<*> {
  googleAuth: typeof Auth

  constructor (props: Props) {
    super();

    this.googleAuth = new Auth({
      domain: 'https://accounts.google.com/o/oauth2/v2/auth',
      clientID: '476296280704-5rfktkjslcfgj72726baam4bedutneem.apps.googleusercontent.com',
      scope: 'email',
      redirectUri: 'http://localhost:3000/callback'
    });
  }

  render() {
    return (
      <AppGrommet centered={false}>
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" render={(props) => <Login auth={this.googleAuth} {...props} /> } />
          <Route exact path="/callback" component={GoogleCallback} />
          <Route component={AppAuthenticated} />
        </Switch>
      </AppGrommet>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  const { auth } = state;

  return {
    token: auth.token
  };
};

export default withRouter(connect(mapStateToProps)(App));
