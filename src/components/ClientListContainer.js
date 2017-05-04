// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {fetchClients} from '../actions/clients';
import ClientList from './ClientList';
import type {Dispatch} from '../types/Store';
import type {State as ReduxState} from '../types/State';
import type {Client} from '../actions/clients';
import type {Business} from '../actions/businesses';

type Props = {
  business: Business,
  clients: Array<Client>,
  token: ?string,
  isFetching: boolean,
  dispatch: Dispatch,
};

type State = {
  searchText: string,
};

class ClientListContainer extends Component<void, Props, State> {
  state: State = {
    searchText: '',
  };

  componentDidMount() {
    const {business, clients, token, dispatch} = this.props;
    if (!clients.length && token) {
      dispatch(fetchClients(token, {business: business.id}));
    }
  }

  render() {
    const {business, clients, isFetching} = this.props;

    const filteredClients = clients.filter(client => {
      const sText = this.state.searchText.toLowerCase();
      if (sText) {
        return `${client.first_name} ${client.last_name}`
          .toLowerCase()
          .includes(sText);
      } else {
        return true;
      }
    });

    return (
      <ClientList
        business={business}
        clients={filteredClients}
        isFetching={isFetching}
        onMore={this.onMore}
        onSearch={this.onSearch}
        searchText={this.state.searchText}
        onClick={this.onClick}
        addClient={this.addClient}
      />
    );
  }

  onMore = () => {};

  onClick = (e, client) => {
    const {business, dispatch} = this.props;
    dispatch(push(`/${business.id}/clients/${client.id}`));
  };

  onSearch = ({target}: SyntheticInputEvent) => {
    this.setState({searchText: target.value});
  };

  addClient = (e: SyntheticInputEvent) => {
    const {business, dispatch} = this.props;
    dispatch(push(`/${business.id}/clients/add`));
  };
}

const mapStateToProps = (
  state: ReduxState,
  ownProps: {match: {params: {businessId: number}}}
): Props => {
  const {businesses, clients, auth} = state;
  const businessId = parseInt(ownProps.match.params.businessId, 10);

  return {
    business: businesses.entities.businesses[businessId],
    clients: clients.result.map((Id: number) => {
      return clients.entities.clients[Id];
    }),
    isFetching: clients.isFetching,
    token: auth.token,
    dispatch: ownProps.dispatch,
  };
};

export default connect(mapStateToProps)(ClientListContainer);
