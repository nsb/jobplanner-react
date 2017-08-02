// @flow

import React, { Component } from "react";
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import { clientSchema } from "../schemas";
import Article from "grommet/components/Article";
import ClientForm from "./ClientForm";
import { updateClient } from "../actions/clients";
import type { Business } from "../actions/businesses";
import type { Client } from "../actions/clients";
import type { State } from "../types/State";
import type { PropertiesMap } from "../actions/properties";

class ClientEdit extends Component {
  props: {
    token?: string,
    business: Business,
    client: Client,
    properties: PropertiesMap,
    updateClient: (client: Client, token: string) => Promise<Client>,
    push: string => void,
    dispatch: Dispatch
  };

  render() {
    const { client } = this.props;

    return (
      <Article align="center" pad={{ horizontal: "medium" }} primary={true}>

        <ClientForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          initialValues={client}
        />

      </Article>
    );
  }

  handleSubmit = (values: Client): void => {
    const { token, client, dispatch } = this.props;
    dispatch(updateClient(
      {
        client,
        ...values
      },
      token || ""
    ));
  };

  onClose = () => {
    const { business, client, push } = this.props;
    push(`/${business.id}/clients/${client.id}`);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {
    match: { params: { businessId: number, clientId: number } },
    history: { push: string => void },
    dispatch: Dispatch
  }
) => {
  const { auth, entities } = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);
  const clientId = parseInt(ownProps.match.params.clientId, 10);

  return {
    token: auth.token,
    business: entities.businesses[businessId],
    client: denormalize(entities.clients[clientId], clientSchema, entities),
    properties: entities.properties,
    push: ownProps.history.push
  };
};

export default connect(mapStateToProps)(ClientEdit);
