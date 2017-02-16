import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Box from 'grommet/components/Box'
import Header from 'grommet/components/Header'
import Title from 'grommet/components/Title'
import Search from 'grommet/components/Search'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import AddIcon from 'grommet/components/icons/base/Add'
// import Spinning from 'grommet/components/icons/Spinning'
import List from 'grommet/components/List'
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import NavControl from './NavControl'
import { fetchClients } from '../actions'
import ClientListItem from './clientListItem'

class Clients extends Component {
  static propTypes = {
    business: PropTypes.number.isRequired,
    clients: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired
  }

  constructor () {
    super()
    this.state = { searchText: '' }
  }

  componentDidMount () {
    const { business, clients, token, dispatch } = this.props
    if (!clients.length) {
      dispatch(fetchClients(token, {business: business}))
    }
  }

  render () {
    const { business, clients, isFetching } = this.props

    // if (isFetching) {
    //   return (
    //     <Spinning />
    //   )
    // }

    const filteredClients = clients.filter((client) => {
      const searchText = this.state.searchText.toLowerCase()
      if (searchText) {
        return `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchText)
      } else {
        return true
      }
    })

    const addControl = (
        <Anchor icon={<AddIcon />} path={`/${business}/clients/add`}
          a11yTitle={`Add business`} onClick={this.handleAdd} />
      )

    return (
      <Box>
        <Header size='large' pad={{ horizontal: 'medium' }}>
          <Title responsive={false}>
            <NavControl />
            <span>Clients</span>
          </Title>
          <Search inline={true} fill={true} size='medium' placeHolder='Search'
            value={this.searchText} onDOMChange={this.onSearch} />
          {addControl}
        </Header>
        <List onMore={isFetching ? this.onMore : null}>
          {filteredClients.map((client, index) => {
            return <ClientListItem key={client.id}
              client={client} index={index} onClick={e => this.onClick(e, client)} />
          })}
        </List>
        <ListPlaceholder filteredTotal={filteredClients.length}
          unfilteredTotal={clients.length}
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
    dispatch(push(`/${business}/clients/add`))
  }
}


const mapStateToProps = (state, ownProps) => {
  const { businesses, clients, auth } = state
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    business: businesses.entities.businesses[businessId].id,
    clients: clients.result.map((Id) => {
      return clients.entities.clients[Id]
    }),
    isFetching: clients.isFetching,
    token: auth.token
  }
}

export default connect(mapStateToProps)(Clients)
