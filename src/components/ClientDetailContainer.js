// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchClients } from "../actions/clients";
import { navResponsive } from "../actions/nav";
import ClientDetail from "./ClientDetail";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Client } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Responsive } from "../actions/nav";

type Props = {
  business: Business,
  client: Client,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  push: string => void
};

class ClientDetailContainer extends Component {
  // componentDidMount() {
  // }

  render() {
    const { business, client, responsive } = this.props;
    return (
      <ClientDetail
        business={business}
        client={client}
        responsive={responsive}
        onEdit={this.onEdit}
        onClose={this.onClose}
        onResponsive={this.onResponsive}
      />
    );
  }

  onResponsive = (responsive: Responsive) => {
    this.props.dispatch(navResponsive(responsive));
  };

  onClose = () => {
    const { business, client, push } = this.props;
    push(`/${business.id}/clients/${client.id}`);
  };

  onEdit = () => {
    const { business, client, push } = this.props;
    push(`/${business.id}/clients/${client.id}/edit`);
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {
    match: { params: { businessId: number, clientId: number } },
    history: { push: Function },
    dispatch: Dispatch
  }
): Props => {
  const { businesses, clients, auth, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);

  return {
    business: businesses.entities.businesses[businessId],
    client: clients.entities.clients[clientId],
    isFetching: clients.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
    push: ownProps.history.push,
    responsive: nav.responsive
  };
};

export default connect(mapStateToProps)(ClientDetailContainer);
