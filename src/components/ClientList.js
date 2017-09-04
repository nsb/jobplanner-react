// @flow

import React from 'react';
import {injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
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

type Props = {
  business: Business,
  clients?: Array<Client>,
  isFetching?: boolean,
  searchText?: string,
  onSearch: SyntheticInputEvent<*> => void,
  onMore: () => void,
  onClick: (SyntheticInputEvent<*>, Client) => void,
  addClient: SyntheticInputEvent<*> => void,
  intl: intlShape,
};

const ClientList = ({
  business,
  clients = [],
  isFetching = false,
  searchText = '',
  onSearch,
  onMore,
  onClick,
  addClient,
  intl,
}: Props) => (
  <Box>
    <Header size="large" pad={{horizontal: 'medium'}}>
      <Title responsive={false}>
        <NavControl />
        <FormattedMessage
          id="clients.title"
          description="Clients title"
          defaultMessage="Clients"
        />
      </Title>
      <Search
        inline={true}
        fill={true}
        size="medium"
        placeHolder="Search"
        value={searchText}
        onDOMChange={onSearch}
      />
      <Anchor
        icon={<AddIcon />}
        path={`/${business.id}/clients/add`}
        a11yTitle={`Add business`}
      />

    </Header>
    <List onMore={isFetching ? onMore : undefined}>
      {clients.map((client: Client, index: number) => {
        return (
          <ClientListItem
            key={client.id}
            client={client}
            index={index}
            onClick={e => onClick(e, client)}
          />
        );
      })}
    </List>
    <ListPlaceholder
      filteredTotal={isFetching ? null : clients.length}
      unfilteredTotal={isFetching ? null : clients.length}
      emptyMessage={intl.formatMessage({
        id: 'clients.emptyMessage',
        defaultMessage: 'You do not have any clients at the moment.',
      })}
      addControl={
        <Button
          icon={<AddIcon />}
          label="Add client"
          primary={true}
          a11yTitle={`Add client`}
          path={`/${business.id}/clients/add`}
        />
      }
    />
  </Box>
);

export default injectIntl(ClientList);
