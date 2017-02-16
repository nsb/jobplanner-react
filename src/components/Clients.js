import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import AddIcon from 'grommet/components/icons/base/Add'
import ListPlaceholder from 'grommet-addons/components/ListPlaceholder'
import { fetchClients } from '../actions'

class Clients extends Component {
  static propTypes = {
    business: PropTypes.number.isRequired,
    token: PropTypes.string.isRequired
  }

  componentWillMount () {
    const { token, dispatch } = this.props
    dispatch(fetchClients(token))
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
    const { business, dispatch } = this.props
    dispatch(push(`/${business}/clients/add`))
  }
}


const mapStateToProps = (state, ownProps) => {
  const { businesses, auth } = state
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    business: businesses.entities.businesses[businessId].id,
    token: auth.token
  }
}

export default connect(mapStateToProps)(Clients)
