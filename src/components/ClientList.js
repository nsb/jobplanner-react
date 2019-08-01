// @flow

import React, { Component } from 'react';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Search from 'grommet/components/Search';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import AddIcon from 'grommet/components/icons/base/Add';
import List from 'grommet/components/List';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';
import NavControl from './NavControl';
import ClientListItem from './ClientListItem';
import type {Business} from '../actions/businesses';
import type {Client} from '../actions/clients';

const intlTitle = (
  <FormattedMessage
    id="clients.title"
    description="Clients title"
    defaultMessage="Clients"
  />
)

const intlSearch = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="clients.search"
    description="Clients search"
    defaultMessage="Search"
  />
)

const intlAdd = (
  <FormattedMessage
    id="clients.add"
    description="Client add"
    defaultMessage="Add client"
  />
)

const intlEmptyMessage = (
  <FormattedMessage
    id="clients.emptyMessage"
    description="Clients empty message"
    defaultMessage="You do not have any clients at the moment."
  />
)

export type Props = {
  business: Business,
  clients: Array<Client>,
  isFetching: boolean,
  push: Function,
  totalCount: number,
  token: ?string,
  fetchClients: (string, Object) => Promise<any>
};

type State = {
  searchText: string,
  searchResults: Array<number>,
  offset: number,
  limit: number
};

class ClientList extends Component<Props & { intl: intlShape }, State> {
  searchTimeout: ?TimeoutID = null;
  state: State = {
    searchText: "",
    searchResults: [],
    offset: 0,
    limit: 25
  };

  componentDidMount() {
    this.onMore();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.searchText !== this.state.searchText) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.setState({ offset: 0, searchResults: [] }, this.onMore);
      }, 500);
    }
  }

  render() {
    const { business, clients, isFetching, intl, totalCount } = this.props;

    const filteredClients = clients.filter(client => {
      if (this.state.searchText) {
        return this.state.searchResults.includes(client.id)
      } else {
        return true;
      }
    });

    return (
      <Box>
        <Header size="large" pad={{horizontal: 'medium'}}>
          <NavControl title={intlTitle} />
          <Search
            inline={true}
            fill={true}
            size="medium"
            placeHolder={intl.formatMessage({id: 'clients.search'})}
            value={this.state.searchText}
            onDOMChange={this.onSearch}
          />
          <Anchor
            icon={<AddIcon />}
            path={`/${business.id}/clients/add`}
            a11yTitle={intlAdd}
          />

        </Header>
        <List onMore={isFetching || this.state.offset > totalCount ? undefined : this.onMore}>
          {filteredClients.map((client: Client, index: number) => {
            return (
              <ClientListItem
                key={client.id}
                client={client}
                index={index}
                onClick={e => this.onClick(e, client)}
              />
            );
          })}
        </List>
        <ListPlaceholder
          filteredTotal={isFetching ? null : filteredClients.length}
          unfilteredTotal={isFetching ? null : this.state.searchText ? clients.length : totalCount}
          emptyMessage={intlEmptyMessage}
          addControl={
            <Button
              icon={<AddIcon />}
              label={intlAdd}
              primary={true}
              a11yTitle={intlAdd}
              path={`/${business.id}/clients/add`}
            />
          }
        />
      </Box>
    );
  }

  onMore = () => {
    const { business, token, fetchClients } = this.props;
    if (token) {
      fetchClients(token, {
        business: business.id,
        ordering: "first_name,last_name",
        limit: this.state.limit,
        offset: this.state.offset,
        search: this.state.searchText
      }).then(resultClients => {
        this.setState({
          offset: this.state.offset + this.state.limit,
          searchResults: resultClients.results.map(client => client.id)
        });
      });
    }
  };

  onClick = (e: SyntheticInputEvent<*>, client: Client) => {
    const { push, business } = this.props;
    push(`/${business.id}/clients/${client.id}`);
  };

  onSearch = ({ target }: SyntheticInputEvent<*>) => {
    this.setState({ searchText: target.value, offset: 0 });
  };

  addClient = (e: SyntheticInputEvent<*>) => {
    const { push, business } = this.props;
    push(`/${business.id}/clients/add`);
  };
}

export default injectIntl(ClientList);
