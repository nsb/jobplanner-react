import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import ClientForm from './ClientForm'
import { updateClient } from '../actions'

class ClientEdit extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  }

  render () {
    const { client } = this.props

    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <ClientForm onSubmit={this.handleSubmit}
          onClose={this.onClose}
          initialValues={client} />

      </Article>
    )

  }

  handleSubmit = (values) => {
    const { token, client } = this.props
    let action = updateClient({
      client,
      ...values,
    }, token)
    this.props.dispatch(action)
  }

  onClose = () => {
    const { business, dispatch } = this.props
    dispatch(push(`/${business.id}/clients`))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { auth, businesses, clients } = state
  const businessId = parseInt(ownProps.params.businessId, 10)
  const clientId = parseInt(ownProps.params.clientId, 10)

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    client: clients.entities.clients[clientId],
  }
}

export default connect(mapStateToProps)(ClientEdit)
