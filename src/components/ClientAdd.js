import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import ClientForm from './ClientForm'
import { createClient } from '../actions'

class ClientAdd extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired
  }

  render () {
    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <ClientForm onSubmit={this.handleSubmit}
          onClose={this.onClose} />

      </Article>
    )

  }

  handleSubmit = (values) => {
    const { token, business } = this.props
    let action = createClient(business, {
      ...values,
      business: `/businesses/${business.id}/`
    }, token)
    this.props.dispatch(action)
  }

  onClose = () => {
    const { business, dispatch } = this.props
    dispatch(push(`/${business.id}/clients`))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { auth, businesses } = state
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId]
  }
}

export default connect(mapStateToProps)(ClientAdd)
