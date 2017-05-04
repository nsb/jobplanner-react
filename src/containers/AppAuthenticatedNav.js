// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import {push} from 'react-router-redux';
import Split from 'grommet/components/Split';
import NavSidebar from '../components/NavSidebar';
import ClientListContainer from '../components/ClientListContainer';
import ClientAdd from '../components/ClientAdd';
import ClientEdit from '../components/ClientEdit';
import Jobs from '../components/Jobs';
import JobsAdd from '../components/JobsAdd';
import JobEdit from '../components/JobEdit';
import {navToggle, navResponsive} from '../actions/nav';
import type {State} from '../types/State';
import type {Dispatch} from '../types/Store';
import type {Business} from '../actions/businesses';

class AppAuthenticatedNav extends Component {
  props: {
    navActive: boolean,
    responsive: string,
    business: Business,
    dispatch: Dispatch,
  };

  componentWillMount() {
    const {business, dispatch} = this.props;
    if (business === undefined) {
      dispatch(push('/404'));
    }
  }

  render() {
    const {navActive, responsive} = this.props;
    const priority = navActive && 'single' === responsive ? 'left' : 'right';

    const {business} = this.props;

    return (
      <Split priority={priority} flex="right" onResponsive={this.onResponsive}>
        {this.props.navActive
          ? <NavSidebar toggleNav={this.toggleNav} business={business} />
          : null}
        <Switch>
          <Route exact path="clients" component={ClientListContainer} />
          <Route exact path="clients/add" component={ClientAdd} />
          <Route exact path="clients/:clientId" component={ClientEdit} />
          <Route exact path="jobs" component={Jobs} />
          <Route exact path="jobs/add" component={JobsAdd} />
          <Route exact path="jobs/:jobId" component={JobEdit} />
          <Route component={ClientListContainer} />
        </Switch>
      </Split>
    );
  }

  onResponsive = (responsive: 'multiple') => {
    this.props.dispatch(navResponsive(responsive));
  };

  toggleNav = () => {
    this.props.dispatch(navToggle());
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {match: {params: {businessId: number}}}
) => {
  const {nav, businesses} = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    navActive: nav.active,
    responsive: nav.responsive,
    business: businesses.entities.businesses[businessId],
  };
};

export default connect(mapStateToProps)(AppAuthenticatedNav);
