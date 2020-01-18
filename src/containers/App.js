// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Switch, Route, BrowserRouter } from "react-router-dom";
import AppGrommet from "grommet/components/App";
import AppAuthenticated from "../containers/AppAuthenticated";
import BusinessAdd from "../components/BusinessAdd";
import { Callback } from "../auth/callback";
import { Logout } from "../auth/logout";
import { LogoutCallback } from "../auth/logoutCallback";
import { PrivateRoute } from "../routes/privateRoute";
// import { Register } from "../components/auth/register";
import { SilentRenew } from "../auth/silentRenew";
// import {PublicPage} from "../components/publicPage"
// import {PrivatePage} from "../components/privatePage"
import type { State } from "../types/State";

import "./App.css";

type Props = {
  token: ?string
};

// export const Routes = (
//     <Switch>
//         <Route exact={true} path="/signin-oidc" component={Callback} />
//         <Route exact={true} path="/logout" component={Logout} />
//         <Route exact={true} path="/logout/callback" component={LogoutCallback} />
//         <Route exact={true} path="/register" component={Register} />
//         <Route exact={true} path="/silentrenew" component={SilentRenew} />
//         <PrivateRoute path="/dashboard" component={PrivatePage} />
//         <Route path="/" component={PublicPage} />
//     </Switch>
// );

const routes = (
  <Switch>
    {/* <Route exact path="/signup" render={(props) => <Signup googleAuth={this.googleAuth} {...props} /> } />
  <Route exact path="/login" render={(props) => <Login googleAuth={this.googleAuth} {...props} /> } />
  <Route exact path="/callback" component={GoogleCallback} /> */}
    <Route exact={true} path="/signin-oidc" component={Callback} />
    <Route exact={true} path="/logout" component={Logout} />
    <Route exact={true} path="/logout/callback" component={LogoutCallback} />
    {/* <Route exact={true} path="/register" component={Register} /> */}
    <Route exact={true} path="/silentrenew" component={SilentRenew} />
    {/* <PrivateRoute path="/dashboard" component={PrivatePage} /> */}
    {/* <Route path="/" component={PublicPage} /> */}
    {/* <PrivateRoute exact path="/add" component={BusinessAdd} /> */}
    <PrivateRoute component={AppAuthenticated} />
  </Switch>
);

class App extends Component<*> {
  render() {
    return (
      <AppGrommet centered={false}>
        <BrowserRouter children={routes} basename={"/"} />
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
