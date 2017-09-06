// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Switch, Route} from 'react-router-dom';
import AppGrommet from 'grommet/components/App';
import AppAuthenticated from '../containers/AppAuthenticated';
import Login from '../components/Login';
import type {State} from '../types/State';

import './App.css';

class App extends Component<*> {

  render() {

    return (
      <AppGrommet centered={false}>

        <Switch>
          <Route exact path="/login" component={Login} />
          <Route component={AppAuthenticated} />
        </Switch>
      </AppGrommet>
    );
  }
}

const mapStateToProps = (state: State) => {
  const {auth} = state;

  return {
    token: auth.token
  };
};


export default withRouter(connect(mapStateToProps)(App));
