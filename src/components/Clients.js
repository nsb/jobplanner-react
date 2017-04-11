// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
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
import { fetchClients } from '../actions'
import ClientListItem from './ClientListItem'
import { FormattedMessage } from 'react-intl'
import type { Dispatch } from '../types/Store'
import type { Client } from '../actions/clients'

type Props = {
  business: Object,
  clients: [Client],
  token: string,
  isFetching: boolean,
  dispatch: Dispatch
}

type State = {
  searchText: string
}

class Clients extends Component<void, Props, State> {

  state: State = {
    searchText: ''
  }

  componentDidMount () {
    const { business, clients, token, dispatch } = this.props
    if (!clients.length) {
      dispatch(fetchClients(token, {business: business.id}))
    }
  }

  render () {
    const { business, clients, isFetching } = this.props

    const filteredClients = clients.filter((client) => {
      const searchText = this.state.searchText.toLowerCase()
      if (searchText) {
        return `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchText)
      } else {
        return true
      }
    })

    const addControl = (
        <Anchor icon={<AddIcon />} path={`/${business.id}/clients/add`}
          a11yTitle={`Add business`} />
      )

    return (
      <Box>
        <Header size='large' pad={{ horizontal: 'medium' }}>
          <Title responsive={false}>
            <NavControl />
            <span>Clients</span>
            <FormattedMessage
              id='app.greeting'
              description='Greeting to welcome the user to the app'
              defaultMessage='Hello, {name}!'
              values={{
                  name: 'Eric'
              }}
            />
          </Title>
          <Search inline={true} fill={true} size='medium' placeHolder='Search'
            value={this.state.searchText} onDOMChange={this.onSearch} />
          {addControl}
        </Header>
        <List onMore={isFetching ? this.onMore : undefined}>
          {filteredClients.map((client, index) => {
            return <ClientListItem key={client.id}
              client={client} index={index} onClick={e => this.onClick(e, client)} />
          })}
        </List>
        <ListPlaceholder filteredTotal={isFetching ? null : filteredClients.length}
          unfilteredTotal={isFetching ? null : clients.length}
          emptyMessage='You do not have any clients at the moment.'
          addControl={
            <Button icon={<AddIcon />} label='Add client'
              primary={true} a11yTitle={`Add client`}
              onClick={this.addClient} />
            } />
      </Box>
    )

  }

  onMore = () => {
  }

  onClick = (e, client) => {
    const { business, dispatch } = this.props
    dispatch(push(`/${business.id}/clients/${client.id}`))
  }

  onSearch = (event) => {
    const searchText = event.target.value
    this.setState({ searchText })
  }

  addClient = (e) => {
    const { business, dispatch } = this.props
    dispatch(push(`/${business.id}/clients/add`))
  }
}


const mapStateToProps = (state, ownProps) => {
  const { businesses, clients, auth } = state
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    business: businesses.entities.businesses[businessId],
    clients: clients.result.map((Id) => {
      return clients.entities.clients[Id]
    }),
    isFetching: clients.isFetching,
    token: auth.token
  }
}

export default connect(mapStateToProps)(Clients)
