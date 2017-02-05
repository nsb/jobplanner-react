import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button';
import AddIcon from 'grommet/components/icons/base/Add';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

class Businesses extends Component {

  render () {
    return (
      <Box>
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

  handleAdd = (e) => {
    this.props.dispatch(push('/add'))
  }
}

export default connect()(Businesses)
