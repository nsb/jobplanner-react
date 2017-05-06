// flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Switch, Redirect, Route} from 'react-router-dom';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import logo from '../logo.svg';
import {navToggle, navResponsive} from '../actions/nav';
import {verifyAuthAndFetchBusinesses} from '../actions';
import type {Dispatch} from '../types/Store';
import type {State} from '../types/State';
import AppAuthenticatedNav from '../containers/AppAuthenticatedNav';
import Businesses from '../components/Businesses';
import BusinessAdd from '../components/BusinessAdd';

class AppAuthenticated extends Component {
  props: {
    isAuthenticated: boolean,
    isFetching: boolean,
    token: string,
    dispatch: Dispatch,
  };

  componentWillMount() {
    const {token, dispatch} = this.props;
    dispatch(verifyAuthAndFetchBusinesses(token));
  }

  render() {
    const {isAuthenticated, isFetching} = this.props;

    if (!isFetching) {
      return (
        <div>
          <Switch>
            <Route exact path="/add" component={BusinessAdd} />
            <Route exact path="/:businessId" component={AppAuthenticatedNav} />
            <Route
              render={() =>
                (isAuthenticated ? <Businesses /> : <Redirect to="/login" />)}
            />
          </Switch>
        </div>
      );
    } else {
      return (
        <Article scrollStep={true} controls={true}>
          <Section
            full={true}
            colorIndex="dark"
            texture="url(img/ferret_background.png)"
            pad="large"
            justify="center"
            align="center"
          >
            <img src={logo} className="App-logo" alt="logo" />
          </Section>
        </Article>
      );
    }
  }

  onResponsive = (responsive: 'multiple') => {
    this.props.dispatch(navResponsive(responsive));
  };

  toggleNav = () => {
    this.props.dispatch(navToggle());
  };
}

const mapStateToProps = (state: State) => {
  const {users, auth, businesses} = state;

  return {
    isAuthenticated: auth.isAuthenticated,
    isFetching: users.isFetching || businesses.isFetching || auth.busy,
    token: auth.token
  };
};

export default connect(mapStateToProps)(AppAuthenticated);
