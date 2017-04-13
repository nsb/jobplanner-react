// @flow
import React, { Component } from 'react'
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
import { FormattedMessage } from 'react-intl'

type Props = {
  business: Object,
  clients: [Client],
  isFetching: boolean,
  searchText: string,
  onSearch: (Object) => void,
  onMore: () => void,
  onClick: (Object, Client) => void,
  addClient: (Object) => void
}

class ClientList extends Component<void, Props, void> {

  render () {
    const { business, clients, isFetching, searchText, onSearch, onMore, onClick, addClient } = this.props

    const addControl = (
        <Anchor icon={<AddIcon />} path={`/${business.id}/clients/add`}
          a11yTitle={`Add business`} />
      )

    return (
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
            value={searchText} onDOMChange={onSearch} />
          {addControl}
        </Header>
        <List onMore={isFetching ? onMore : undefined}>
          {clients.map((client, index) => {
            return <ClientListItem
              key={client.id}
              client={client}
              index={index}
              onClick={(e: SyntheticInputEvent) => onClick(e, client)} />
          })}
        </List>
        <ListPlaceholder filteredTotal={isFetching ? null : clients.length}
          unfilteredTotal={isFetching ? null : clients.length}
          emptyMessage='You do not have any clients at the moment.'
          addControl={
            <Button icon={<AddIcon />} label='Add client'
              primary={true} a11yTitle={`Add client`}
              onClick={addClient} />
            } />
      </Box>
    )

  }
}

export default ClientList
