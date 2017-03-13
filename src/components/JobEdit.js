import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Article from 'grommet/components/Article'
import JobForm from './JobForm'
import { createJob } from '../actions'
import { push } from 'react-router-redux'

class JobEdit extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
  }

  render () {
    const { clients, job } = this.props

    return (
      <Article align="center" pad={{horizontal: 'medium'}} primary={true}>

        <JobForm onSubmit={this.handleSubmit}
          onClose={this.onClose}
          clients={clients}
          initialValues={{...job, client: { label: 'niels', value: 1 }}} />

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
  const { auth, businesses, clients, jobs } = state
  const businessId = parseInt(ownProps.params.businessId, 10)
  const jobId = parseInt(ownProps.params.jobId, 10)

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    clients: clients.result.map((Id) => {
      return clients.entities.clients[Id]
    }),
    job: jobs.entities.jobs[jobId]
  }
}

export default connect(mapStateToProps)(JobEdit)
