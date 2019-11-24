// @flow

import React, { Component } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Search from 'grommet/components/Search';
import Button from 'grommet/components/Button';
import AddIcon from 'grommet/components/icons/base/Add';
import List from 'grommet/components/List';
import Anchor from 'grommet/components/Anchor';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';
import NavControl from './NavControl';
import ClientListItem from './ClientListItem';
import ClientAdd from './ClientAdd';
import type { Business } from '../actions/businesses';
import type { Client } from '../actions/clients';
import type { Responsive } from "../actions/nav";

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

const intlAddons = ( // eslint-disable-line no-unused-vars
  <FormattedMessage
    id="clients.addons"
    descriptions="Add-ons"
    defaultMessage="Add-ons"
  />
)

export type Props = {
  business: Business,
  clients: Array<Client>,
  isFetching: boolean,
  push: Function,
  totalCount: number,
  token: ?string,
  fetchClients: (string, Object) => Promise<any>,
  responsive: Responsive
};

type State = {
  searchText: string,
  searchResults: Array<number>,
  offset: number,
  limit: number,
  add: boolean
};

class ClientList extends Component<Props & { intl: intlShape }, State> {
  searchTimeout: ?TimeoutID = null;
  state: State = {
    searchText: "",
    searchResults: [],
    offset: 0,
    limit: 25,
    add: false
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
    const { business, clients, isFetching, intl, totalCount, responsive } = this.props;
    const { add } = this.state;

    if (add) {
      return <ClientAdd business={business} onClose={this.onHideAdd} />
    }

    const filteredClients = clients.filter(client => {
      if (this.state.searchText) {
        return this.state.searchResults.includes(client.id)
      } else {
        return true;
      }
    });

    const search = clients.length ? (
      <Search
        inline={true}
        fill={true}
        size="medium"
        placeHolder={intl.formatMessage({ id: 'clients.search' })}
        value={this.state.searchText}
        onDOMChange={this.onSearch}
      />
    ) : undefined

    return (
      <Box>
        <Header size="large" pad={{ horizontal: 'medium' }}>
          <NavControl title={intlTitle} />
          {search}
          {clients.length ? responsive === "single" ?
            <Anchor
              icon={<AddIcon />}
              onClick={this.onShowAdd}
              a11yTitle={intlAdd}
            /> : <Button label={intlAdd}
              accent={true}
              onClick={this.onShowAdd}
            /> : undefined}

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
          emptyMessage={
            <FormattedMessage
              id="clients.emptyMessage"
              values={{
                link: (
                  <Anchor label={intl.formatMessage({ id: "clients.addons" })} path={`/${business.id}/integrations`} />
                )
              }}
              defaultMessage="Add a client or import clients from your invoicing system via our {link}."
            />
          }
          addControl={
            <Button
              icon={<AddIcon />}
              label={intlAdd}
              primary={true}
              a11yTitle={intlAdd}
              onClick={this.onShowAdd}
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

  onShowAdd = () => this.setState({ add: true })
  onHideAdd = () => this.setState({ add: false })

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
