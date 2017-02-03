import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button';
import AddIcon from 'grommet/components/icons/base/Add';
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder';

class Clients extends Component {
  static propTypes = {
    nav: PropTypes.object,
  }

  render () {
    return (
      <Box>
        <ListPlaceholder filteredTotal={0}
          unfilteredTotal={0}
          emptyMessage='You do not have any clients at the moment.'
          addControl={
            <Button icon={<AddIcon />} label='Add client'
              primary={true} a11yTitle={`Add client`}
              onClick={this.addClient} />
            } />
      </Box>
    )

  }

  addClient = (e) => {
    this.props.dispatch(push('/clients/add'))
  }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(Clients)
