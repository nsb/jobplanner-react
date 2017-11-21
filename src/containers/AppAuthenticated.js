// flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Redirect, Route } from "react-router-dom";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Toast from "grommet/components/Toast";
import logo from "../logo.svg";
import { navToggle, navResponsive } from "../actions/nav";
import { verifyAuthAndFetchBusinesses } from "../actions";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";
import type { FlashMessage as FlashMessageShape } from "redux-flash-messages";
import AppAuthenticatedNav from "../containers/AppAuthenticatedNav";
import Businesses from "../components/Businesses";
import BusinessAdd from "../components/BusinessAdd";

class AppAuthenticated extends Component {
  props: {
    isAuthenticated: boolean,
    isFetching: boolean,
    token: string,
    dispatch: Dispatch,
    messages: Array<FlashMessageShape>
  };

  componentWillMount() {
    const { token, dispatch } = this.props;
    dispatch(verifyAuthAndFetchBusinesses(token));
  }

  renderToast = message => {
    const status = {
      SUCCESS: "ok",
      ERROR: "critical"
    }

    return (
      <Toast status={status[message.type]}>
        {message.text}
      </Toast>
    );
  };

  render() {
    const { isAuthenticated, isFetching, messages } = this.props;

    if (!isFetching) {
      let toasts = (
        <div>
          {messages.map(message => this.renderToast(message))}
        </div>
      );

      let routes = (
        <Switch>
          <Route exact path="/add" component={BusinessAdd} />
          <Route path="/:businessId" component={AppAuthenticatedNav} />
          <Route component={Businesses} />
        </Switch>
      );

      return (
        <div>
          {toasts}
          <Route
            render={() => (isAuthenticated ? routes : <Redirect to="/login" />)}
          />
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

  onResponsive = (responsive: "multiple") => {
    this.props.dispatch(navResponsive(responsive));
  };

  toggleNav = () => {
    this.props.dispatch(navToggle());
  };
}

const mapStateToProps = (state: State) => {
  const { users, auth, businesses, flashMessage } = state;

  return {
    isAuthenticated: auth.isAuthenticated,
    isFetching: users.isFetching || businesses.isFetching || auth.busy,
    token: auth.token,
    messages: flashMessage.messages
  };
};

export default connect(mapStateToProps)(AppAuthenticated);
