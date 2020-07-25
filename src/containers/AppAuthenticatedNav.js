// @flow

import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import posthog from "posthog-js";
import Loadable from "react-loadable";
import Split from "grommet/components/Split";
import Loading from "../components/Loading";
import NavSidebar from "../components/NavSidebar";
import ClientListContainer from "../components/ClientListContainer";
import ClientDetail from "../components/ClientDetailContainer";
import { AbilityContext, Can } from "../components/Can";
import ability from "../ability";
import { navToggle, navResponsive } from "../actions/nav";
import type { State } from "../types/State";
import type { Dispatch, ThunkAction } from "../types/Store";
import type { Business } from "../actions/businesses";
import type { User } from "../actions/users";
import type { Responsive } from "../actions/nav";
import type { Employee } from "../actions/employees";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  navActive: boolean,
  responsive: string,
  business: Business,
  dispatch: Dispatch,
  match: { url: string },
  user: User,
  currentEmployee: Employee,
  navResponsive: (Responsive) => ThunkAction,
  navToggle: () => ThunkAction,
};

const Jobs = Loadable({
  loader: () => import("../components/Jobs"),
  loading: Loading,
});

const CalendarContainer = Loadable({
  loader: () => import("../components/CalendarContainer"),
  loading: Loading,
});

const Reports = Loadable({
  loader: () => import("../components/Reports"),
  loading: Loading,
});

const Settings = Loadable({
  loader: () => import("../components/Settings"),
  loading: Loading,
});

const Invoices = Loadable({
  loader: () => import("../components/Invoices"),
  loading: Loading,
});

const Integrations = Loadable({
  loader: () => import("../components/Integrations"),
  loading: Loading,
});

class AppAuthenticatedNav extends Component<Props> {
  constructor(props: Props) {
    super(props);
    posthog.identify(props.user.username);
  }

  render() {
    const {
      navActive,
      responsive,
      user,
      currentEmployee,
      navToggle,
      business,
    } = this.props;
    const priority = navActive && "single" === responsive ? "left" : "right";

    return (
      <AbilityContext.Provider value={ability(currentEmployee)}>
        <Split
          priority={priority}
          flex="right"
          onResponsive={this.onResponsive}
        >
          {this.props.navActive ? (
            <NavSidebar toggleNav={navToggle} business={business} user={user} />
          ) : null}
          <Switch>
            <Route
              exact
              path="/:businessId/calendar"
              component={CalendarContainer}
            />
            <Route
              exact
              path="/:businessId/clients/:clientId"
              component={ClientDetail}
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
            <Can I="create" a="client" passThrough>
              {(allowed) =>
                allowed ? (
                  <Redirect to={`/${business.id}/clients`} />
                ) : (
                  <Redirect to={`/${business.id}/calendar`} />
                )
              }
            </Can>
          </Switch>
        </Split>
      </AbilityContext.Provider>
    );
  }

  onResponsive = (responsive: Responsive) => {
    this.props.navResponsive(responsive);
  };
}

const mapStateToProps = (
  { employees, nav, entities, users }: State,
  ownProps: {
    match: { params: { businessId: number }, url: string },
    navResponsive: ("multiple") => ThunkAction,
    navToggle: () => ThunkAction,
  }
) => {
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    navActive: nav.active,
    responsive: nav.responsive,
    business: ensureState(entities).businesses[businessId],
    match: ownProps.match,
    user: users.me,
    currentEmployee: employees.result
      .map((Id: number) => {
        return ensureState(entities).employees[Id];
      })
      .find((employee) => employee.me),
    navResponsive: ownProps.navResponsive,
    navToggle: ownProps.navToggle,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ navResponsive, navToggle }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppAuthenticatedNav);
