// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";
import Toast from "grommet/components/Toast";
// import store from "../store";
// import { refresh } from "../actions/auth";
import { verifyAuthAndFetchBusinesses } from "../actions";
import type { Dispatch } from "../types/Store";
import type { State } from "../types/State";
import type { FlashMessage as FlashMessageShape } from "redux-flash-messages";
import AppAuthenticatedNav from "../containers/AppAuthenticatedNav";
import Businesses from "../components/Businesses";
import BusinessAdd from "../components/BusinessAdd";
import { AuthContext } from "../providers/authProvider";

type Props = {
  isFetching: boolean,
  dispatch: Dispatch,
  messages: Array<FlashMessageShape>,
};

class AppAuthenticated extends Component<Props> {
  static contextType = AuthContext;

  componentDidMount() {
    const { dispatch } = this.props;

    const { getUser } = this.context;
    getUser().then(({ access_token }) => {
      dispatch(verifyAuthAndFetchBusinesses(access_token));
    });
  }

  renderToast = (message) => {
    const status = {
      SUCCESS: "ok",
      ERROR: "critical",
    };

    return <Toast status={status[message.type]}>{message.text}</Toast>;
  };

  render() {
    const { isFetching, messages } = this.props;

    if (!isFetching) {
      let toasts = (
        <div>{messages.map((message) => this.renderToast(message))}</div>
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
          <Route render={() => routes} />
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
            <Spinning size="large" />
          </Section>
        </Article>
      );
    }
  }
}

const mapStateToProps = (state: State) => {
  const { users, businesses, flashMessage } = state;

  return {
    isFetching: users.isFetching || businesses.isFetching,
    messages: flashMessage.messages,
  };
};

export default connect(mapStateToProps)(AppAuthenticated);
