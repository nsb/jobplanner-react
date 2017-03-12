import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Article from 'grommet/components/Article'
import JobForm from './JobForm'
import { createJob } from '../actions'

class JobsAdd extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired
  }

  render () {
    const { clients } = this.props

    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <JobForm onSubmit={this.handleSubmit}
          onClose={this.onClose}
          clients={clients} />

      </Article>
    )

  }

  handleSubmit = (values) => {
    // get client Id
    const { client : { option : { value : clientId }}} = values

    const { token, business } = this.props
    let action = createJob({
      ...values,
      business: `/businesses/${business.id}/`,
      recurrences: '',
      client: `/clients/${clientId}/`
    }, token)
    this.props.dispatch(action)
  }

  onClose = () => {
    const { business, dispatch } = this.props
    dispatch(push(`/${business.id}/jobs`))
  }
}

const mapStateToProps = (state, ownProps) => {
  const { auth, businesses, clients } = state
  const businessId = parseInt(ownProps.params.businessId, 10)

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    clients: clients.result.map((Id) => {
      return clients.entities.clients[Id]
    }),
  }
}

export default connect(mapStateToProps)(JobsAdd)
