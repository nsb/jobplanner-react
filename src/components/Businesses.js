// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push as pushActionCreator } from 'react-router-redux'
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
import BusinessListItem from './businessListItem'
import type { Business } from '../actions/businesses'
import type { State } from '../types/State'

class Businesses extends Component {
  props: {
    businesses: Array<Business>,
    push: typeof pushActionCreator
  }

  state: {
    searchText: string
  }

  constructor () {
    super()
    this.state = { searchText: '' }
  }

  componentDidMount () {
    const { businesses, push } = this.props

    // Redirect if we only have one business
    if (businesses.length === 1) {
      push(`/${businesses[0].id}`)
    }
  }

  render () {
    const { businesses } = this.props
    const filteredBusinesses = businesses.filter((business) => {
      const searchText = this.state.searchText.toLowerCase()
      if (searchText) {
        return business.name.toLowerCase().includes(searchText)
      } else {
        return true
      }
    })

    const addControl = (
        <Anchor icon={<AddIcon />} path='/add'
          a11yTitle={`Add business`} onClick={this.handleAdd} />
      )

    return (
      <Box>
        <Header size='large' pad={{ horizontal: 'medium' }}>
          <Title responsive={false}>
            <NavControl />
            <span>Businesses</span>
          </Title>
          <Search inline={true} fill={true} size='medium' placeHolder='Search'
            value={this.state.searchText} onDOMChange={this.onSearch} />
          {addControl}
        </Header>
        <List onMore={undefined}>
          {filteredBusinesses.map((business, index) => {
            return <BusinessListItem key={business.id}
              business={business} index={index} onClick={(e: SyntheticInputEvent) => this.onClick(e, business)} />
          })}
        </List>
        <ListPlaceholder filteredTotal={filteredBusinesses.length}
          unfilteredTotal={businesses.length}
          emptyMessage='You do not have any businesses.'
          addControl={
            <Button icon={<AddIcon />} label='Add business'
              primary={true} a11yTitle={`Add business`}
              onClick={this.handleAdd} />
            } />
      </Box>
    )

  }

  onClick = (e, business) => {
    this.props.push(`/${business.id}`)
  }

  onSearch = (e: SyntheticInputEvent) => {
    const searchText = e.target.value
    this.setState({ searchText })
  }

  handleAdd = (e) => {
    this.props.push('/add')
  }
}

const mapStateToProps = (state: State) => {
  const { businesses } = state

  return {
    businesses: businesses.result.map((Id) => {
      return businesses.entities.businesses[Id]
    })
  }
}

const mapDispatchToProps = (dispatch: *) => bindActionCreators({
  push: pushActionCreator
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Businesses)
