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
import List from 'grommet/components/List'
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import NavControl from './NavControl'
import BusinessListItem from './businessListItem'

class Businesses extends Component {
  static propTypes = {
    businesses: PropTypes.array.isRequired
  }

  render () {
    const { businesses } = this.props
    const searchText = ''
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
            value={searchText} onDOMChange={this.onSearch} />
          {addControl}
        </Header>
        <List onMore={() => false}>
          {businesses.map((business, index) => {
            return <BusinessListItem key={business.id}
              business={business} index={index} onClick={e => this.onClick(e, business)} />
          })}
        </List>
        <ListPlaceholder filteredTotal={0}
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
    const { dispatch } = this.props
    dispatch(push(`/${business.id}`))
  }

  onSearch = () => {

  }

  handleAdd = (e) => {
    this.props.dispatch(push('/add'))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { businesses } = state

  return {
    businesses: businesses.result.map((Id) => {
      return businesses.entities.businesses[Id]
    })
  }
}

export default connect(mapStateToProps)(Businesses)
