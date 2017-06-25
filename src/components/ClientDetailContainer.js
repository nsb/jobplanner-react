// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchClient } from "../actions/clients";
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
  clientId: number,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  push: string => void,
  responsive: Responsive
};

class ClientDetailContainer extends Component {
  componentDidMount() {
    const {client, clientId, token, dispatch} = this.props;
    if (!client && token) {
      dispatch(fetchClient(token, clientId));
    }
  }

  render() {
    const { business, client, properties, responsive, isFetching } = this.props;

    const clientDetail = (
      <ClientDetail
        business={business}
        client={client}
        properties={properties}
        responsive={responsive}
        onEdit={this.onEdit}
        onClose={this.onClose}
        onResponsive={this.onResponsive}
      />
    );

    const loadingClients = (
      <div>Loading...</div>
    )

    return isFetching ? loadingClients : clientDetail
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
  const { businesses, clients, entities, auth, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);

  return {
    business: businesses.entities.businesses[businessId],
    client: entities.clients[clientId],
    properties: entities.properties,
    clientId: clientId,
    isFetching: clients.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
    push: ownProps.history.push,
    responsive: nav.responsive
  };
};

export default connect(mapStateToProps)(ClientDetailContainer);
