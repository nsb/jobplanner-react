import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class JobEdit extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    business: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
  }

  render () {
    return (
      <div>Hejsa</div>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  const { auth, businesses, jobs } = state
  const businessId = parseInt(ownProps.params.businessId, 10)
  const jobId = parseInt(ownProps.params.jobId, 10)

  return {
    token: auth.token,
    business: businesses.entities.businesses[businessId],
    job: jobs.entities.jobs[jobId]
  }
}

export default connect(mapStateToProps)(JobEdit)
