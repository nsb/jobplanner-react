// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Split from "grommet/components/Split";
import Spinning from "grommet/components/icons/Spinning";
import NavSidebar from "../components/NavSidebar";
import ClientListContainer from "../components/ClientListContainer";
import ClientAdd from "../components/ClientAdd";
import ClientDetail from "../components/ClientDetailContainer";
import ClientEdit from "../components/ClientEdit";
import { navToggle, navResponsive } from "../actions/nav";
import type { State } from "../types/State";
import type { Dispatch } from "../types/Store";
import type { Business } from "../actions/businesses";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  navActive: boolean,
  responsive: string,
  business: Business,
  dispatch: Dispatch,
  match: { url: string }
};

const Loading = () => (
  <Article scrollStep={true} controls={true}>
    <Section full={true} pad="large" justify="center" align="center">
      <Spinning size="large"/>
    </Section>
  </Article>
);

const Jobs = Loadable({
  loader: () => import("../components/Jobs"),
  loading: Loading
});

const CalendarContainer = Loadable({
  loader: () => import("../components/CalendarContainer"),
  loading: Loading
});

const CalendarListContainer = Loadable({
  loader: () => import("../components/CalendarListContainer"),
  loading: Loading
});

const Settings = Loadable({
  loader: () => import("../components/Settings"),
  loading: Loading
});

class AppAuthenticatedNav extends Component<Props> {
  render() {
    const { navActive, responsive } = this.props;
    const priority = navActive && "single" === responsive ? "left" : "right";

    const { business } = this.props;

    return (
      <Split priority={priority} flex="right" onResponsive={this.onResponsive}>
        {this.props.navActive ? (
          <NavSidebar toggleNav={this.toggleNav} business={business} />
        ) : null}
        <Switch>
          <Route
            exact
            path="/:businessId/calendar"
            component={
              responsive === "multiple"
                ? CalendarContainer
                : CalendarListContainer
            }
          />
          <Route exact path="/:businessId/clients/add" component={ClientAdd} />
          <Route
            exact
            path="/:businessId/clients/:clientId"
            component={ClientDetail}
          />
          <Route
            exact
            path="/:businessId/clients/:clientId/edit"
            component={ClientEdit}
          />
          <Route
            exact
            path="/:businessId/clients"
            component={ClientListContainer}
          />
          <Route path="/:businessId/jobs" component={Jobs} />
          <Route path="/:businessId/settings" component={Settings} />
          <Route component={ClientListContainer} />
        </Switch>
      </Split>
    );
  }

  onResponsive = (responsive: "multiple") => {
    this.props.dispatch(navResponsive(responsive));
  };

  toggleNav = () => {
    this.props.dispatch(navToggle());
  };
}

const mapStateToProps = (
  state: State,
  ownProps: { match: { params: { businessId: number }, url: string } }
) => {
  const { nav, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    navActive: nav.active,
    responsive: nav.responsive,
    business: ensureState(entities).businesses[businessId],
    match: ownProps.match
  };
};

export default connect(mapStateToProps, (dispatch: Dispatch) => ({
  dispatch: dispatch
}))(AppAuthenticatedNav);
