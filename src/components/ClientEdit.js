// @flow

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {push as pushActionCreator} from 'react-router-redux';
import Article from 'grommet/components/Article';
import ClientForm from './ClientForm';
import {updateClient} from '../actions/clients';
import type {Business} from '../actions/businesses';
import type {Client} from '../actions/clients';
import type {State} from '../types/State';

class ClientEdit extends Component {
  props: {
    token?: string,
    business: Business,
    client: Client,
    updateClient: (d: Dispatch) => Promise<Client>,
    push: typeof pushActionCreator,
  };

  render() {
    const {client} = this.props;

    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <ClientForm
          onSubmit={this.handleSubmit}
          onClose={this.onClose}
          initialValues={client}
        />

      </Article>
    );
  }

  handleSubmit = (values: Client): void => {
    const {token, client, updateClient} = this.props;
    updateClient(
      {
        client,
        ...values,
      },
      token || ''
    );
  };

  onClose = () => {
    const {business, push} = this.props;
    push(`/${business.id}/clients`);
  };
}

const mapStateToProps = (
  state: State,
  ownProps: {params: {businessId: number, clientId: number}}
) => {
  const {auth, businesses, clients} = state;
  const businessId = parseInt(ownProps.params.businessId, 10);
  const clientId = parseInt(ownProps.params.clientId, 10);

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    client: clients.entities.clients[clientId],
  };
};

const mapDispatchToProps = (dispatch: *) =>
  bindActionCreators(
    {
      push: pushActionCreator,
      updateClient,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ClientEdit);
