// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchClient } from "../actions/clients";
import { navResponsive } from "../actions/nav";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Spinning from "grommet/components/icons/Spinning";
import ClientDetail from "./ClientDetail";
import type { Dispatch } from "../types/Store";
import type { State as ReduxState } from "../types/State";
import type { Client } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Property } from "../actions/properties";
import type { Responsive } from "../actions/nav";
import { ensureState } from "redux-optimistic-ui";

type Props = {
  business: Business,
  client: Client,
  properties: Array<Property>,
  clientId: number,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
  push: string => void,
  responsive: Responsive
};

class ClientDetailContainer extends Component<Props> {
  componentDidMount() {
    const { client, clientId, token, dispatch } = this.props;
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
      <Article scrollStep={true} controls={true}>
        <Section
          full={true}
          colorIndex="dark"
          // texture="url(img/ferret_background.png)"
          pad="large"
          justify="center"
          align="center"
        >
          <Spinning />
        </Section>
      </Article>
    );

    return isFetching ? loadingClients : clientDetail;
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
  const { clients, entities, auth, nav } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);

  return {
    business: ensureState(entities).businesses[businessId],
    client: ensureState(entities).clients[clientId],
    properties: ensureState(entities).properties,
    clientId: clientId,
    isFetching: clients.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
    push: ownProps.history.push,
    responsive: nav.responsive
  };
};

export default connect(mapStateToProps)(ClientDetailContainer);
