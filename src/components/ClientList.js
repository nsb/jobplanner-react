// @flow
import React from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import Box from 'grommet/components/Box'
import Header from 'grommet/components/Header'
import Title from 'grommet/components/Title'
import Search from 'grommet/components/Search'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import AddIcon from 'grommet/components/icons/base/Add'
import List from 'grommet/components/List'
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import NavControl from './NavControl'
import ClientListItem from './ClientListItem'

type Props = {
  business: Object,
  clients: [Client],
  isFetching: boolean,
  searchText: string,
  onSearch: (SyntheticInputEvent) => void,
  onMore: () => void,
  onClick: (SyntheticInputEvent, Client) => void,
  addClient: (SyntheticInputEvent) => void,
  intl: intlShape
}

const ClientList = (props: Props) =>
  <Box>
    <Header size='large' pad={{ horizontal: 'medium' }}>
      <Title responsive={false}>
        <NavControl />
        <FormattedMessage
          id='clients.title'
          description='Clients title'
          defaultMessage='Clients'
        />
      </Title>
      <Search inline={true} fill={true} size='medium' placeHolder='Search'
        value={props.searchText} onDOMChange={props.onSearch} />
      <Anchor icon={<AddIcon />} path={`/${props.business.id}/clients/add`}
          a11yTitle={`Add business`} />

    </Header>
    <List onMore={props.isFetching ? props.onMore : undefined}>
      {props.clients.map((client, index) => {
        return <ClientListItem
          key={client.id}
          client={client}
          index={index}
          onClick={(e: SyntheticInputEvent) => props.onClick(e, client)} />
      })}
    </List>
    <ListPlaceholder filteredTotal={props.isFetching ? null : props.clients.length}
      unfilteredTotal={props.isFetching ? null : props.clients.length}
      emptyMessage={props.intl.formatMessage({
        id: 'clients.emptyMessage',
        defaultMessage: 'You do not have any clients at the moment.'})}
      addControl={
        <Button icon={<AddIcon />} label='Add client'
          primary={true} a11yTitle={`Add client`}
          onClick={props.addClient} />
        } />
  </Box>

export default injectIntl(ClientList)
