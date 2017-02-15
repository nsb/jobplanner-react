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
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import NavControl from './NavControl'

class Businesses extends Component {

  render () {
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
        <ListPlaceholder filteredTotal={0}
          unfilteredTotal={0}
          emptyMessage='You do not have any businesses.'
          addControl={
            <Button icon={<AddIcon />} label='Add business'
              primary={true} a11yTitle={`Add business`}
              onClick={this.handleAdd} />
            } />
      </Box>
    )

  }

  onSearch = () => {

  }

  handleAdd = (e) => {
    this.props.dispatch(push('/add'))
  }
}

export default connect()(Businesses)
