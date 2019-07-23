// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import Split from "grommet/components/Split";
import Loading from "../components/Loading";
import NavSidebar from "../components/NavSidebar";
import ClientListContainer from "../components/ClientListContainer";
import ClientAdd from "../components/ClientAdd";
import ClientDetail from "../components/ClientDetailContainer";
import ClientEdit from "../components/ClientEdit";
import { logout } from "../actions/auth";
import { navToggle, navResponsive } from "../actions/nav";
import type { State } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { User } from "../actions/users";
import type { Responsive } from "../actions/nav";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  navActive: boolean,
  responsive: string,
  business: Business,
  dispatch: Dispatch,
  match: { url: string },
  user: User,
  logout: () => ThunkAction,
  navResponsive: (Responsive) => ThunkAction,
  navToggle: () => ThunkAction
};

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

const Reports = Loadable({
  loader: () => import("../components/Reports"),
  loading: Loading
});

const Settings = Loadable({
  loader: () => import("../components/Settings"),
  loading: Loading
});

const Invoices = Loadable({
  loader: () => import("../components/Invoices"),
  loading: Loading
})

const Integrations = Loadable({
  loader: () => import("../components/Integrations"),
  loading: Loading
})

class AppAuthenticatedNav extends Component<Props> {
  render() {
    const {
      navActive,
      responsive,
      user,
      logout,
      navToggle,
      business
    } = this.props;
    const priority = navActive && "single" === responsive ? "left" : "right";

    return (
      <Split priority={priority} flex="right" onResponsive={this.onResponsive}>
        {this.props.navActive ? (
          <NavSidebar
            toggleNav={navToggle}
            business={business}
            user={user}
            logout={logout}
          />
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
          <Route path="/:businessId/reports" component={Reports} />
          <Route path="/:businessId/settings" component={Settings} />
          <Route path="/:businessId/invoices" component={Invoices} />
          <Route path="/:businessId/integrations" component={Integrations} />
          <Redirect to={`/${business.id}/clients`} />
        </Switch>
      </Split>
    );
  }

  onResponsive = (responsive: Responsive) => {
    this.props.navResponsive(responsive);
  };
}

const mapStateToProps = (
  { nav, entities, users }: State,
  ownProps: {
    match: { params: { businessId: number }, url: string },
    logout: () => ThunkAction,
    navResponsive: ("multiple") => ThunkAction,
    navToggle: () => ThunkAction
  }
) => {
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    navActive: nav.active,
    responsive: nav.responsive,
    business: ensureState(entities).businesses[businessId],
    match: ownProps.match,
    user: users.me,
    logout: ownProps.logout,
    navResponsive: ownProps.navResponsive,
    navToggle: ownProps.navToggle
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ logout, navResponsive, navToggle }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppAuthenticatedNav);
